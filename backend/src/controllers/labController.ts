import { Request, Response } from 'express';
import Docker from 'dockerode';
import { RoomService } from '../services/room.service';

const docker = new Docker({ socketPath: '/var/run/docker.sock' });

function getImageForLab(labType: string): string {
    if (labType === 'python') {
        return 'yourusername/python-lab:latest';
    }
    return '2024ashikul/basic-lab:latest';
}

export const startLab = async (req: Request, res: Response) => {
    const { labId, labType } = req.body;
    const roomService = new RoomService();
    try {
        console.log(`Request received to start lab: ${labId}`);
        const members = await roomService.getRoomMembers(labId);

        if (!members || members.length === 0) {
            return res.status(404).json({ message: 'No members found in this room.' });
        }

        const userList = members.map(member => `${member.name}:${member.role}`).join(' ');
        console.log(`Creating lab with user list: "${userList}"`);
        const imageName = getImageForLab(labType);

        // Define the path for Traefik to match
        const pathPrefix = `/labs/${labId}`;

        const container = await docker.createContainer({
            Image: imageName,
            Labels: {
                'traefik.enable': 'true',
                // Rule to match the URL
                [`traefik.http.routers.${labId}.rule`]: `PathPrefix(\`${pathPrefix}\`)`,
                // Target service port (internal Nginx)
                [`traefik.http.services.${labId}.loadbalancer.server.port`]: '80',

                // --- THE FIX IS HERE ---
                // 1. Define a middleware to strip the prefix
                [`traefik.http.middlewares.${labId}-strip.stripprefix.prefixes`]: pathPrefix,
                // 2. Apply that middleware to the router
                [`traefik.http.routers.${labId}.middlewares`]: `${labId}-strip`
            },
            Env: [`USER_LIST=${userList}`], // BASE_PATH is no longer needed
            HostConfig: {
                NetworkMode: 'backend'
            }
        });

        await container.start();

        const labUrl = `http://localhost${pathPrefix}`;
        res.status(200).json({ message: 'Lab created successfully', labUrl });

    } catch (error: any) {
        console.error('Error starting lab:', error);
        res.status(500).json({ error: 'Failed to start lab.', details: error.message });
    }
};