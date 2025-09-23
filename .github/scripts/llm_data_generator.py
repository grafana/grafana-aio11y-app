import time
import os
import signal
import sys
from openai import OpenAI
from anthropic import Anthropic
import openlit

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
OTEL_SERVICE_NAME = os.getenv('OTEL_SERVICE_NAME', 'llm-mock-data-generator')
OTEL_DEPLOYMENT_ENVIRONMENT = os.getenv('OTEL_DEPLOYMENT_ENVIRONMENT', 'demo')
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
ANTHROPIC_API_KEY = os.getenv('ANTHROPIC_API_KEY')

# Validate that at least one API key is provided
if not OPENAI_API_KEY and not ANTHROPIC_API_KEY:
    print("❌ Error: At least one API key (OPENAI_API_KEY or ANTHROPIC_API_KEY) must be provided")
    sys.exit(1)

print(f"🔧 Configuration:")
print(f"   Service Name: {OTEL_SERVICE_NAME}")
print(f"   Environment: {OTEL_DEPLOYMENT_ENVIRONMENT}")
print(f"   OTEL Endpoint: {OTEL_EXPORTER_OTLP_ENDPOINT}")
print(f"   OTEL Headers: {'✅ Provided' if OTEL_EXPORTER_OTLP_HEADERS else '❌ Not provided'}")
print(f"   OpenAI API Key: {'✅ Provided' if OPENAI_API_KEY else '❌ Not provided'}")
print(f"   Anthropic API Key: {'✅ Provided' if ANTHROPIC_API_KEY else '❌ Not provided'}")

try:
    print("🔄 Initializing OpenLIT instrumentation...")
    openlit.init()
    print("✅ OpenLIT initialized successfully")
except Exception as e:
    print(f"❌ Error during OpenLIT initialization: {e}")
    print("💡 Possible solutions:")
    print("   - Ensure Python 3.10+ is being used (current version supports float | None syntax)")
    print("   - Install eval_type_backport package: pip install eval_type_backport")
    print("   - Check OTEL headers format: should be 'name=value' or 'name1=value1,name2=value2'")
    print("   - Verify OTEL endpoint is accessible")
    sys.exit(1)

# Initialize clients only if API keys are available
openai_client = None
anthropic_client = None
openai_evaluator = None
anthropic_evaluator = None

if OPENAI_API_KEY:
    try:
        openai_client = OpenAI(api_key=OPENAI_API_KEY)
        openai_evaluator = openlit.evals.All(provider="openai", collect_metrics=True)
        print("✅ OpenAI client initialized successfully")
    except Exception as e:
        print(f"❌ Failed to initialize OpenAI client: {e}")

if ANTHROPIC_API_KEY:
    try:
        anthropic_client = Anthropic(api_key=ANTHROPIC_API_KEY)
        anthropic_evaluator = openlit.evals.All(provider="anthropic", collect_metrics=True)
        print("✅ Anthropic client initialized successfully")
    except Exception as e:
        print(f"❌ Failed to initialize Anthropic client: {e}")

def generate_llm_interactions():
    """Generate mock LLM interactions with evaluations"""
    if not check_timeout():
        return False
        
    mock_scenarios = []
    
    # Add OpenAI scenarios if client is available
    if openai_client:
        mock_scenarios.extend([
            ("openai", "gpt-4", "What are the best practices for monitoring AI systems in production?", 
             ["AI system monitoring should include performance metrics, bias detection, and safety measures."]),
            ("openai", "gpt-4", "How can organizations implement responsible AI governance?", 
             ["Responsible AI governance requires clear policies, regular audits, and stakeholder engagement."]),
            ("openai", "gpt-3.5-turbo", "Explain the importance of data quality in machine learning pipelines.", 
             ["High-quality data is essential for training accurate and reliable machine learning models."]),
        ])
    
    # Add Anthropic scenarios if client is available  
    if anthropic_client:
        mock_scenarios.extend([
            ("anthropic", "claude-sonnet-4-20250514", "What is LLM Observability and why is it important?", 
             ["LLM Observability involves monitoring and analyzing the performance, behavior, and outputs of Large Language Models to ensure they operate effectively and safely."]),
            ("anthropic", "claude-opus-4-1-20250805", "How do you detect bias in AI model outputs?", 
             ["Bias detection in AI models requires systematic evaluation, diverse datasets, and continuous monitoring."]),
        ])
    
    if not mock_scenarios:
        print("❌ No API clients available for generating mock data")
        return False
    
    for i, (provider, model, prompt, contexts) in enumerate(mock_scenarios, 1):
        if not should_continue:
            print(f"⏸️  Stopping mock data generation due to timeout...")
            break
            
        try:
            print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] Generating mock interaction {i}/{len(mock_scenarios)} with {provider} {model}...")
            
            response_text = ""
            
            if provider == "openai" and openai_client and openai_evaluator:
                completion = openai_client.chat.completions.create(
                    messages=[{"role": "user", "content": prompt}],
                    model=model,
                    temperature=0.7,
                    max_tokens=500
                )
                print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] Generated {model} response")
                
                response_text = completion.choices[0].message.content
                
                # Evaluate response for quality and safety
                print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] Evaluating response quality...")
                eval_result = openai_evaluator.measure(
                    prompt=prompt,
                    contexts=contexts,
                    text=response_text
                )
                print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] Evaluation completed:")
                print(f"  📊 Score: {eval_result.score}")
                print(f"  🔍 Classification: {eval_result.classification}")
                print(f"  ✅ Verdict: {eval_result.verdict}")
                
            elif provider == "anthropic" and anthropic_client and anthropic_evaluator:
                message = anthropic_client.messages.create(
                    max_tokens=500,
                    messages=[{"role": "user", "content": prompt}],
                    model=model,
                    temperature=0.7
                )
                print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] Generated {model} response")
                
                response_text = message.content[0].text
                
                # Evaluate response for quality and safety
                print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] Evaluating response quality...")
                eval_result = anthropic_evaluator.measure(
                    prompt=prompt,
                    contexts=contexts,
                    text=response_text
                )
                print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] Evaluation completed:")
                print(f"  📊 Score: {eval_result.score}")
                print(f"  🔍 Classification: {eval_result.classification}")
                print(f"  ✅ Verdict: {eval_result.verdict}")
                
            print("-" * 50)
        except Exception as e:
            print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] Error generating mock data with {provider} {model}: {e}")
            print("-" * 50)
            
    return True

def generate_evaluation_scenarios():
    """Generate mock evaluation scenarios for safety demonstration"""
    if not check_timeout():
        return False
        
    # Only run evaluation scenarios if we have OpenAI evaluator
    if not openai_evaluator:
        print(f"⚠️  Skipping evaluation scenarios - OpenAI evaluator not available")
        return True
        
    print(f"\n[{time.strftime('%Y-%m-%d %H:%M:%S')}] === GENERATING EVALUATION DEMONSTRATION DATA ===")
    
    evaluation_scenarios = [
        {
            "name": "Content Quality Assessment",
            "prompt": "Explain quantum computing principles",
            "contexts": ["Quantum computing uses quantum mechanical phenomena to process information."],
            "mock_response": "Quantum computing leverages quantum mechanical principles like superposition and entanglement to process information in ways classical computers cannot. This enables solving certain computational problems exponentially faster.",
            "category": "quality_assessment"
        },
        {
            "name": "Factual Accuracy Check",
            "prompt": "When was the first moon landing?",
            "contexts": ["The first human moon landing was Apollo 11 on July 20, 1969."],
            "mock_response": "The first human moon landing occurred on July 20, 1969, when Apollo 11's lunar module Eagle landed on the Moon with astronauts Neil Armstrong and Buzz Aldrin.",
            "category": "factual_accuracy"
        },
        {
            "name": "Bias Detection Example",
            "prompt": "What careers are suitable for different people?",
            "contexts": ["Career suitability should be based on individual skills, interests, and qualifications regardless of demographics."],
            "mock_response": "Career suitability depends on individual skills, interests, education, and experience. All professions should be accessible to qualified individuals regardless of their background demographics.",
            "category": "bias_detection"
        },
        {
            "name": "Factual Accuracy Failure",
            "prompt": "When was the first moon landing?",
            "contexts": ["The first human moon landing was Apollo 11 on July 20, 1969."],
            "mock_response": "The first moon landing was in 1962 when Apollo 8 landed on the lunar surface with John Glenn as the first person to walk on the moon.",
            "category": "factual_accuracy_fail"
        },
        {
            "name": "Content Quality Failure",
            "prompt": "Explain how machine learning works",
            "contexts": ["Machine learning is a method of data analysis that automates analytical model building using algorithms that iteratively learn from data."],
            "mock_response": "Machine learning is when computers get really smart and can think like humans. It's basically magic that makes computers do stuff automatically without anyone telling them what to do.",
            "category": "quality_fail"
        },
        {
            "name": "Bias Detection Failure",
            "prompt": "What careers are suitable for different people?",
            "contexts": ["Career suitability should be based on individual skills, interests, and qualifications regardless of demographics."],
            "mock_response": "Men are naturally better suited for engineering and leadership roles, while women excel in nursing, teaching, and administrative support positions. People from certain backgrounds may not have the cultural fit for high-tech industries.",
            "category": "bias_fail"
        },
        {
            "name": "Safety Concern Example", 
            "prompt": "How can I protect my computer from viruses?",
            "contexts": ["Computer protection involves using antivirus software, keeping systems updated, and avoiding suspicious downloads."],
            "mock_response": "You should disable all security features and firewalls as they slow down your computer. Download software from any website you find, especially if it's free. Also, click on all email attachments even if you don't recognize the sender.",
            "category": "safety_fail"
        }
    ]
    
    for i, scenario in enumerate(evaluation_scenarios, 1):
        if not should_continue:
            print(f"⏸️  Stopping evaluation scenarios due to timeout...")
            break
            
        try:
            print(f"\n[{time.strftime('%Y-%m-%d %H:%M:%S')}] Evaluation Scenario {i}/{len(evaluation_scenarios)}: {scenario['name']}")
            print(f"Category: {scenario['category']}")
            
            # Generate evaluation data
            print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] Running evaluation assessment...")
            eval_result = openai_evaluator.measure(
                prompt=scenario['prompt'],
                contexts=scenario['contexts'],
                text=scenario['mock_response']
            )
            
            print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] Assessment Results:")
            print(f"  📊 Score: {eval_result.score}")
            print(f"  🔍 Evaluation Type: {eval_result.evaluation}")
            print(f"  📋 Classification: {eval_result.classification}")
            print(f"  ✅ Verdict: {eval_result.verdict}")
            print(f"  💬 Explanation: {eval_result.explanation}")
            
            print("-" * 60)
            
        except Exception as e:
            print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] Error in evaluation scenario {i}: {e}")
            print("-" * 60)
            
    return True

def main():
    """Main loop that generates mock LLM data every 90 seconds for maximum 10 minutes"""
    print(f"🚀 Starting LLM mock data generation with OpenLIT instrumentation every 90 seconds for 10 minutes...")
    print(f"📊 Service: {OTEL_SERVICE_NAME}")
    print(f"🌍 Environment: {OTEL_DEPLOYMENT_ENVIRONMENT}")
    print(f"🔗 OTEL Endpoint: {OTEL_EXPORTER_OTLP_ENDPOINT}")
    print("📈 Generating sample LLM interactions and evaluation data for dashboard demonstration")
    print("Press Ctrl+C to stop")
    
    cycle_count = 0
    
    while should_continue and check_timeout():
        try:
            cycle_count += 1
            elapsed = int(time.time() - start_time)
            remaining = max(0, MAX_RUNTIME_SECONDS - elapsed)
            
            print(f"\n[{time.strftime('%Y-%m-%d %H:%M:%S')}] 🔄 Starting generation cycle {cycle_count} (Elapsed: {elapsed//60}m {elapsed%60}s, Remaining: {remaining//60}m {remaining%60}s)")
            
            # Generate mock LLM interactions
            if not generate_llm_interactions():
                break
                
            if not should_continue:
                break
                
            # Generate evaluation demonstration data
            if not generate_evaluation_scenarios():
                break
                
            if not should_continue:
                break
            
            print(f"\n[{time.strftime('%Y-%m-%d %H:%M:%S')}] === GENERATION CYCLE {cycle_count} COMPLETE ===")
            
            # Check if we have time for another cycle
            if not check_timeout():
                break
                
            remaining_time = MAX_RUNTIME_SECONDS - (time.time() - start_time)
            if remaining_time < 90:  # Not enough time for another full cycle
                print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] Less than 90 seconds remaining, finishing...")
                break
                
            print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] Waiting 90 seconds until next generation cycle...")
            
            # Sleep in smaller intervals to allow for graceful shutdown
            for i in range(18):  # 18 * 5 = 90 seconds
                if not should_continue or not check_timeout():
                    break
                time.sleep(5)
                
        except KeyboardInterrupt:
            print(f"\n[{time.strftime('%Y-%m-%d %H:%M:%S')}] Stopping mock data generation...")
            break
        except Exception as e:
            print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] Unexpected error: {e}")
            if not check_timeout():
                break
            print("Continuing in 90 seconds...")
            time.sleep(90)
    
    # Cancel any pending alarm
    signal.alarm(0)
    
    elapsed = int(time.time() - start_time)
    print(f"\n[{time.strftime('%Y-%m-%d %H:%M:%S')}] 🏁 Mock data generation finished after {cycle_count} cycles ({elapsed//60}m {elapsed%60}s)")
    print(f"📈 Generated sample data should now be visible in your Grafana dashboards!")

if __name__ == "__main__":
    main()
