export interface Mission {
	id: string;
	title: string;
	description: string;
	status: 'active' | 'pending' | 'completed' | 'failed';
	priority: 'low' | 'medium' | 'high' | 'critical';
	progress: number;
	assignedAgent: string;
	deadline: string;
	objectives: string[];
}