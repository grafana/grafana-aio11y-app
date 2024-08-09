import { Button } from '@grafana/ui';
import React, { useState } from 'react';

interface InstallDashboardProps {
    filePath: any;
}

const InstallDashboard: React.FC<InstallDashboardProps> = ({ filePath }) => {
    const [message, setMessage] = useState('');

    const installDashboard = async () => {
        try {
            if (typeof filePath !== 'string') {
                throw new Error('Invalid file path');
            }

            const fileResponse = await fetch(filePath);
            if (!fileResponse.ok) {
                throw new Error('Failed to fetch file');
            }
            const jsonData = await fileResponse.json();

            const serverResponse = await fetch('http://localhost:3000/api/dashboards/db', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(jsonData),
            });

            if (serverResponse.ok) {
                setMessage('Installed');
            } else {
                setMessage('Failed to install dashboard');
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('Error');
        }
    };

    const handleInstallClick = async () => {
        await installDashboard();
    };

    return (
        <div>
            <Button onClick={handleInstallClick}>Install Dashboard</Button>
            <p>{message}</p>
        </div>
    );
};

export default InstallDashboard;
