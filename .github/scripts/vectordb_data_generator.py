import time
import os
import signal
import sys
import uuid
from typing import List, Dict, Any, Optional

# ChromaDB imports
import chromadb

# Qdrant imports  
from qdrant_client import QdrantClient
from qdrant_client.http import models
from qdrant_client.http.models import (
    Distance, VectorParams, PointStruct, Filter, 
    FieldCondition, Match, UpdateStatus
)

# Common imports
import openlit
import numpy as np

# Global flag for timeout handling
should_continue = True
start_time = time.time()
MAX_RUNTIME_SECONDS = 10 * 60  # 10 minutes

def timeout_handler(signum, frame):
    """Handle timeout signal"""
    global should_continue
    should_continue = False
    print(f"\n[{time.strftime('%Y-%m-%d %H:%M:%S')}] ⏰ Timeout reached (10 minutes). Gracefully shutting down...")

def check_timeout():
    """Check if we've exceeded the maximum runtime"""
    global should_continue, start_time
    if time.time() - start_time >= MAX_RUNTIME_SECONDS:
        should_continue = False
        print(f"\n[{time.strftime('%Y-%m-%d %H:%M:%S')}] ⏰ Maximum runtime reached (10 minutes). Shutting down...")
        return False
    return True

# Set up signal handler for timeout
signal.signal(signal.SIGALRM, timeout_handler)
signal.alarm(MAX_RUNTIME_SECONDS)

# Get configuration from standard OTEL environment variables
OTEL_EXPORTER_OTLP_ENDPOINT = os.getenv('OTEL_EXPORTER_OTLP_ENDPOINT', 'http://localhost:4317')
OTEL_EXPORTER_OTLP_HEADERS = os.getenv('OTEL_EXPORTER_OTLP_HEADERS', '')
OTEL_SERVICE_NAME = os.getenv('OTEL_SERVICE_NAME', 'vectordb-mock-data-generator')
OTEL_DEPLOYMENT_ENVIRONMENT = os.getenv('OTEL_DEPLOYMENT_ENVIRONMENT', 'demo')

print(f"🔧 Configuration:")
print(f"   Service Name: {OTEL_SERVICE_NAME}")
print(f"   Environment: {OTEL_DEPLOYMENT_ENVIRONMENT}")
print(f"   OTEL Endpoint: {OTEL_EXPORTER_OTLP_ENDPOINT}")

openlit.init()

# Initialize ChromaDB client (using modern persistent client)
chroma_client = chromadb.PersistentClient(path="./chroma_db")

# Initialize Qdrant client (using in-memory storage for mock data)
# For production, use: qdrant_client = QdrantClient("localhost", port=6333)
qdrant_client = QdrantClient(":memory:")

# =============================================================================
# COMMON UTILITIES
# =============================================================================

def generate_sample_vectors(n_vectors: int = 5, dimension: int = 384) -> List[List[float]]:
    """Generate sample vectors for mock vector database operations"""
    return np.random.rand(n_vectors, dimension).tolist()

def log_message(message: str, database: str = ""):
    """Log message with timestamp and database identifier"""
    db_prefix = f"[{database.upper()}] " if database else ""
    print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] {db_prefix}{message}")

# =============================================================================
# CHROMADB MOCK DATA OPERATIONS
# =============================================================================

def generate_chroma_mock_documents() -> List[Dict[str, Any]]:
    """Generate sample documents for ChromaDB mock data"""
    sample_docs = [
        "AI system monitoring best practices for production environments",
        "Machine learning model deployment strategies and considerations", 
        "Vector database performance optimization techniques",
        "LLM observability and evaluation frameworks",
        "Real-time analytics for AI applications"
    ]
    
    return [
        {
            "id": f"chroma_mock_{i}",
            "document": doc,
            "metadata": {
                "database": "chromadb", 
                "category": "ai-ops", 
                "type": "knowledge-base",
                "timestamp": time.time()
            }
        }
        for i, doc in enumerate(sample_docs, 1)
    ]

def create_chroma_mock_collection():
    """Create ChromaDB collection for mock data generation"""
    if not check_timeout():
        return None
        
    collection_name = f"chroma_mock_{int(time.time())}"
    
    try:
        log_message(f"Creating mock collection: {collection_name}", "ChromaDB")
        
        # Create collection with metadata
        collection = chroma_client.create_collection(
            name=collection_name,
            metadata={
                "description": "ChromaDB mock data collection for Grafana dashboard demonstration", 
                "database": "chromadb",
                "purpose": "observability-demo"
            }
        )
        
        log_message("Mock collection created successfully", "ChromaDB")
        
        # List collections for visibility
        collections = chroma_client.list_collections()
        log_message(f"Active collections: {len(collections)}", "ChromaDB")
        
        return collection
        
    except Exception as e:
        log_message(f"Error creating mock collection: {e}", "ChromaDB")
        return None

def generate_chroma_mock_operations(collection):
    """Generate mock document operations for ChromaDB"""
    if not collection or not check_timeout():
        log_message("No collection available for mock operations", "ChromaDB")
        return False
    
    try:
        log_message("Generating mock document operations", "ChromaDB")
        
        # Generate sample data
        mock_docs = generate_chroma_mock_documents()
        mock_embeddings = generate_sample_vectors(len(mock_docs))
        
        # Add documents to simulate real usage
        collection.add(
            embeddings=mock_embeddings,
            documents=[doc["document"] for doc in mock_docs],
            metadatas=[doc["metadata"] for doc in mock_docs],
            ids=[doc["id"] for doc in mock_docs]
        )
        
        log_message(f"Added {len(mock_docs)} mock documents", "ChromaDB")
        
        # Simulate queries for observability data
        query_embedding = generate_sample_vectors(1)[0]
        results = collection.query(
            query_embeddings=[query_embedding],
            n_results=3,
            include=['documents', 'metadatas', 'distances']
        )
        
        log_message(f"Mock similarity search returned {len(results['ids'][0])} results", "ChromaDB")
        
        # Get collection stats
        count = collection.count()
        log_message(f"Collection contains {count} documents", "ChromaDB")
        
        return True
        
    except Exception as e:
        log_message(f"Error in mock operations: {e}", "ChromaDB")
        return False

def run_chroma_mock_cycle():
    """Run a complete cycle of ChromaDB mock operations"""
    if not check_timeout():
        return False
        
    log_message("Starting ChromaDB mock data generation cycle", "ChromaDB")
    
    collection = None
    try:
        # Create mock collection
        collection = create_chroma_mock_collection()
        if not collection or not should_continue:
            return False
        
        # Generate mock operations
        if not generate_chroma_mock_operations(collection) or not should_continue:
            return False
        
        log_message("Mock data generation cycle completed successfully", "ChromaDB")
        return True
        
    except Exception as e:
        log_message(f"Error in mock cycle: {e}", "ChromaDB")
        return False
    
    finally:
        # Clean up mock collections
        cleanup_chroma_mock_data()

def cleanup_chroma_mock_data():
    """Clean up ChromaDB mock data collections"""
    try:
        collections = chroma_client.list_collections()
        mock_collections = [c for c in collections if c.name.startswith("chroma_mock_")]
        
        for collection in mock_collections:
            try:
                chroma_client.delete_collection(collection.name)
                log_message(f"Cleaned up mock collection: {collection.name}", "ChromaDB")
            except Exception as e:
                log_message(f"Error cleaning up {collection.name}: {e}", "ChromaDB")
                
    except Exception as e:
        log_message(f"Error in cleanup: {e}", "ChromaDB")

# =============================================================================
# QDRANT MOCK DATA OPERATIONS
# =============================================================================

def generate_qdrant_mock_points(collection_name: str, start_id: int = 1, count: int = 5) -> List[PointStruct]:
    """Generate mock points for Qdrant demo data"""
    vectors = generate_sample_vectors(count)
    points = []
    
    mock_contents = [
        "AI model performance monitoring dashboard",
        "Vector database query optimization guide", 
        "Machine learning pipeline observability",
        "Real-time AI system health checks",
        "LLM evaluation metrics and tracking"
    ]
    
    for i in range(count):
        point_id = start_id + i
        content = mock_contents[i % len(mock_contents)]
        
        points.append(
            PointStruct(
                id=point_id,
                vector=vectors[i],
                payload={
                    "text": f"{content} - sample data point {point_id}",
                    "database": "qdrant",
                    "category": "ai-monitoring",
                    "type": "knowledge-base",
                    "timestamp": time.time(),
                    "demo": True
                }
            )
        )
    
    return points

def create_qdrant_mock_collection():
    """Create Qdrant collection for mock data generation"""
    if not check_timeout():
        return None
        
    collection_name = f"qdrant_mock_{int(time.time())}"
    
    try:
        log_message(f"Creating mock collection: {collection_name}", "Qdrant")
        
        # Create collection with vector configuration
        qdrant_client.create_collection(
            collection_name=collection_name,
            vectors_config=VectorParams(size=384, distance=Distance.COSINE),
            timeout=60
        )
        
        log_message("Mock collection created successfully", "Qdrant")
        
        # Get collection info for observability
        collection_info = qdrant_client.get_collection(collection_name)
        log_message(f"Collection vectors_count: {collection_info.vectors_count}", "Qdrant")
        
        # List collections
        collections = qdrant_client.get_collections()
        log_message(f"Active collections: {len(collections.collections)}", "Qdrant")
        
        return collection_name
        
    except Exception as e:
        log_message(f"Error creating mock collection: {e}", "Qdrant")
        return None

def generate_qdrant_mock_operations(collection_name: str):
    """Generate mock point operations for Qdrant"""
    if not collection_name or not check_timeout():
        log_message("No collection available for mock operations", "Qdrant")
        return False
    
    try:
        log_message("Generating mock point operations", "Qdrant")
        
        # Generate and insert mock points
        mock_points = generate_qdrant_mock_points(collection_name)
        
        operation_info = qdrant_client.upsert(
            collection_name=collection_name,
            wait=True,
            points=mock_points
        )
        
        log_message(f"Added {len(mock_points)} mock points", "Qdrant")
        log_message(f"Operation status: {operation_info.status}", "Qdrant")
        
        # Simulate vector search for observability data
        query_vector = generate_sample_vectors(1)[0]
        
        search_results = qdrant_client.search(
            collection_name=collection_name,
            query_vector=query_vector,
            limit=3,
            with_payload=True
        )
        
        log_message(f"Mock vector search returned {len(search_results)} results", "Qdrant")
        for i, result in enumerate(search_results, 1):
            print(f"  {i}. Point {result.id} (score: {result.score:.4f})")
        
        # Simulate filtered search
        filtered_results = qdrant_client.search(
            collection_name=collection_name,
            query_vector=query_vector,
            query_filter=Filter(
                must=[
                    FieldCondition(
                        key="category",
                        match=Match(value="ai-monitoring")
                    )
                ]
            ),
            limit=2,
            with_payload=True
        )
        
        log_message(f"Filtered search returned {len(filtered_results)} results", "Qdrant")
        
        return True
        
    except Exception as e:
        log_message(f"Error in mock operations: {e}", "Qdrant")
        return False

def run_qdrant_mock_cycle():
    """Run a complete cycle of Qdrant mock operations"""
    if not check_timeout():
        return False
        
    log_message("Starting Qdrant mock data generation cycle", "Qdrant")
    
    collection_name = None
    try:
        # Create mock collection
        collection_name = create_qdrant_mock_collection()
        if not collection_name or not should_continue:
            return False
        
        # Generate mock operations
        if not generate_qdrant_mock_operations(collection_name) or not should_continue:
            return False
        
        log_message("Mock data generation cycle completed successfully", "Qdrant")
        return True
        
    except Exception as e:
        log_message(f"Error in mock cycle: {e}", "Qdrant")
        return False
    
    finally:
        # Clean up mock collections
        cleanup_qdrant_mock_data()

def cleanup_qdrant_mock_data():
    """Clean up Qdrant mock data collections"""
    try:
        collections = qdrant_client.get_collections()
        for collection in collections.collections:
            if collection.name.startswith("qdrant_mock_"):
                try:
                    qdrant_client.delete_collection(collection.name)
                    log_message(f"Cleaned up mock collection: {collection.name}", "Qdrant")
                except Exception as e:
                    log_message(f"Error cleaning up {collection.name}: {e}", "Qdrant")
                    
    except Exception as e:
        log_message(f"Error in cleanup: {e}", "Qdrant")

# =============================================================================
# PERFORMANCE DEMONSTRATION
# =============================================================================

def run_performance_demo():
    """Run performance demonstration to generate metrics"""
    if not check_timeout():
        return False
        
    log_message("=== GENERATING PERFORMANCE DEMONSTRATION DATA ===")
    
    try:
        # ChromaDB performance demo
        if should_continue:
            log_message("Running ChromaDB performance demonstration", "ChromaDB")
            demo_collection = chroma_client.create_collection(name=f"chroma_perf_demo_{int(time.time())}")
            
            # Bulk operations for metrics
            bulk_docs = [f"Performance demo document {i} for metrics generation" for i in range(25)]
            bulk_embeddings = generate_sample_vectors(25)
            bulk_ids = [f"perf_doc_{i}" for i in range(25)]
            
            start_time_op = time.time()
            demo_collection.add(
                embeddings=bulk_embeddings,
                documents=bulk_docs,
                ids=bulk_ids,
                metadatas=[{"demo": True, "batch": "performance"} for _ in range(25)]
            )
            insert_time = time.time() - start_time_op
            log_message(f"Bulk insert completed in {insert_time:.2f}s", "ChromaDB")
            
            # Cleanup demo collection
            chroma_client.delete_collection(demo_collection.name)
        
        # Qdrant performance demo
        if should_continue and check_timeout():
            log_message("Running Qdrant performance demonstration", "Qdrant")
            demo_collection = f"qdrant_perf_demo_{int(time.time())}"
            
            qdrant_client.create_collection(
                collection_name=demo_collection,
                vectors_config=VectorParams(size=384, distance=Distance.COSINE)
            )
            
            # Bulk operations for metrics
            demo_points = []
            demo_vectors = generate_sample_vectors(25)
            for i in range(25):
                demo_points.append(
                    PointStruct(
                        id=i + 1,
                        vector=demo_vectors[i],
                        payload={"demo": True, "batch": "performance", "point": i}
                    )
                )
            
            start_time_op = time.time()
            qdrant_client.upsert(
                collection_name=demo_collection,
                wait=True,
                points=demo_points
            )
            insert_time = time.time() - start_time_op
            log_message(f"Bulk insert completed in {insert_time:.2f}s", "Qdrant")
            
            # Cleanup demo collection
            qdrant_client.delete_collection(demo_collection)
        
        return True
        
    except Exception as e:
        log_message(f"Error in performance demo: {e}")
        return False

# =============================================================================
# MAIN EXECUTION
# =============================================================================

def run_all_mock_operations():
    """Run mock operations for both ChromaDB and Qdrant"""
    if not check_timeout():
        return False
        
    log_message("========================================")
    log_message("STARTING VECTOR DATABASE MOCK DATA GENERATION")
    log_message("========================================")
    
    success_count = 0
    total_operations = 3
    
    try:
        # Run ChromaDB mock operations
        if should_continue and check_timeout():
            log_message("Generating ChromaDB mock data...")
            if run_chroma_mock_cycle():
                success_count += 1
                log_message("✅ ChromaDB mock data generated successfully")
            else:
                log_message("⚠️ ChromaDB mock data generation incomplete")
        
        # Run Qdrant mock operations
        if should_continue and check_timeout():
            log_message("Generating Qdrant mock data...")
            if run_qdrant_mock_cycle():
                success_count += 1
                log_message("✅ Qdrant mock data generated successfully")
            else:
                log_message("⚠️ Qdrant mock data generation incomplete")
        
        # Run performance demonstration
        if should_continue and check_timeout():
            if run_performance_demo():
                success_count += 1
                log_message("✅ Performance demonstration data generated")
            else:
                log_message("⚠️ Performance demonstration incomplete")
        
    except Exception as e:
        log_message(f"Error in mock operations: {e}")
    
    log_message("========================================")
    log_message(f"GENERATION COMPLETE: {success_count}/{total_operations} operations successful")
    log_message("========================================")
    
    return success_count > 0

def main():
    """Main loop that generates vector database mock data every 60 seconds for maximum 10 minutes"""
    print(f"🚀 Starting vector database mock data generation with OpenLIT instrumentation every 60 seconds for 10 minutes...")
    print(f"📊 Service: {OTEL_SERVICE_NAME}")
    print(f"🌍 Environment: {OTEL_DEPLOYMENT_ENVIRONMENT}")
    print(f"🔗 OTEL Endpoint: {OTEL_EXPORTER_OTLP_ENDPOINT}")
    print("📈 Generating: ChromaDB & Qdrant operations, performance demos for dashboard visibility")
    print("Press Ctrl+C to stop")
    
    cycle_count = 0
    
    while should_continue and check_timeout():
        try:
            cycle_count += 1
            elapsed = int(time.time() - start_time)
            remaining = max(0, MAX_RUNTIME_SECONDS - elapsed)
            
            print(f"\n[{time.strftime('%Y-%m-%d %H:%M:%S')}] 🔄 Starting generation cycle {cycle_count} (Elapsed: {elapsed//60}m {elapsed%60}s, Remaining: {remaining//60}m {remaining%60}s)")
            
            # Generate mock data for all vector databases
            if not run_all_mock_operations():
                if not should_continue:
                    break
                log_message("Some operations incomplete, but continuing...")
            
            if not should_continue or not check_timeout():
                break
            
            log_message(f"Generation cycle {cycle_count} completed")
            
            # Check if we have time for another cycle
            remaining_time = MAX_RUNTIME_SECONDS - (time.time() - start_time)
            if remaining_time < 60:  # Not enough time for another full cycle
                log_message("Less than 60 seconds remaining, finishing...")
                break
                
            log_message("Waiting 60 seconds until next generation cycle...")
            
            # Sleep in smaller intervals to allow for graceful shutdown
            for i in range(12):  # 12 * 5 = 60 seconds
                if not should_continue or not check_timeout():
                    break
                time.sleep(5)
            
        except KeyboardInterrupt:
            log_message("Stopping vector database mock data generation...")
            break
        except Exception as e:
            log_message(f"Unexpected error: {e}")
            if not check_timeout():
                break
            log_message("Continuing in 60 seconds...")
            time.sleep(60)
    
    # Cancel any pending alarm
    signal.alarm(0)
    
    elapsed = int(time.time() - start_time)
    print(f"\n[{time.strftime('%Y-%m-%d %H:%M:%S')}] 🏁 Mock data generation finished after {cycle_count} cycles ({elapsed//60}m {elapsed%60}s)")
    print(f"📈 Generated sample data should now be visible in your Grafana dashboards!")

if __name__ == "__main__":
    main()
