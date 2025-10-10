import { Request, Response } from 'express';
import Docker from 'dockerode';
import { RoomService } from '../services/room.service'; // Assuming this is the correct path

// Connect to the Docker engine via its socket
const docker = new Docker({ socketPath: '/var/run/docker.sock' });

// This function gets the correct image name based on the lab type
function getImageForLab(labType: string): string {
    if (labType === 'python') {
        return 'yourusername/python-lab:latest';
    }
    return '2024ashikul/basic-lab:latest'; 
}

export const startLab = async (req: Request, res: Response) => {
    const { roomId, labType } = req.body; 
    const labId = roomId;
    const roomService = new RoomService();

    try {
        console.log(`Request received to start lab: ${labId}`);

        // 1. Get the list of members with their roles from your database
        const members = await roomService.getRoomMembers(roomId);

        if (!members || members.length === 0) {
            return res.status(404).json({ message: 'No members found in this room to create a lab.' });
        }

        // 2. Transform the member objects into a space-separated "username:role" string
        //    Example: "ashik:teacher sazid:student naim:student"
        //    FIX: Use the 'name' property for the username, not 'userId'.
        const userList = members.map(member => `${member.name}:${member.role}`).join(' ');

        console.log(`Creating lab with user list: "${userList}"`);
        const imageName = getImageForLab(labType);

        // 3. Tell Docker to create and start a new container with the real user list
        const container = await docker.createContainer({
            Image: imageName,
            Labels: {
                'traefik.enable': 'true',
                [`traefik.http.routers.${labId}.rule`]: `PathPrefix(\`/labs/${labId}\`)`,
                [`traefik.http.services.${labId}.loadbalancer.server.port`]: '8080'
            },
            Env: [`USER_LIST=${userList}`] 
        });
        
        await container.start();

        const labUrl = `http://localhost/labs/${labId}`;
        res.status(200).json({ message: 'Lab created successfully', labUrl });

    } catch (error: any) {
        console.error('Error starting lab:', error);
        res.status(500).json({ error: 'Failed to start lab.', details: error.message });
    }
};