import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import HUDPanel from '@/components/HUDPanel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/components/ui/use-toast';
import { Mission } from '@/lib/types';

const schema = z.object({
	title: z.string().min(3, 'Title must be at least 3 characters'),
	description: z.string().min(10, 'Description must be at least 10 characters'),
	priority: z.enum(['low', 'medium', 'high', 'critical']),
	deadline: z.string().min(1, 'Deadline is required'),
});

type FormValues = z.infer<typeof schema>;

const CreateMission = () => {
	const navigate = useNavigate();
	const form = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: {
			title: '',
			description: '',
			priority: 'medium',
			deadline: '',
		},
	});

	const onSubmit = (values: FormValues) => {
		const mission: Mission = {
			id: `MISSION_${Date.now().toString().slice(-6)}`,
			title: values.title.toUpperCase().replace(/\s+/g, '_'),
			description: values.description,
			status: 'pending',
			priority: values.priority,
			progress: 0,
			assignedAgent: 'ECHO_001',
			deadline: values.deadline,
			objectives: [
				'Initialize mission parameters',
				'Execute primary objective',
				'Complete mission report',
			],
		};

		try {
			const stored = localStorage.getItem('missions');
			const existing: Mission[] = stored ? JSON.parse(stored) : [];
			localStorage.setItem('missions', JSON.stringify([mission, ...existing]));
			toast({ title: 'MISSION_CREATED', description: `${mission.id} initialized` });
			navigate('/missions');
		} catch (err) {
			console.error('Failed to save mission', err);
			toast({ title: 'ERROR', description: 'Failed to create mission' });
		}
	};

	return (
		<div className="min-h-screen pt-20 p-6 space-y-6">
			<h1 className="hud-text text-2xl font-bold tracking-widest">CREATE_MISSION</h1>
			<HUDPanel title="MISSION_FORM">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="hud-text text-sm">MISSION_TITLE</FormLabel>
									<FormControl>
										<Input placeholder="Enter mission title..." className="bg-secondary border-primary/30 text-primary" {...field} />
									</FormControl>
									<FormDescription className="text-xs">Use code-like formatting; it will be uppercased</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="hud-text text-sm">DESCRIPTION</FormLabel>
									<FormControl>
										<Textarea rows={4} placeholder="Mission briefing and objectives..." className="bg-secondary border-primary/30 text-primary" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="priority"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="hud-text text-sm">PRIORITY</FormLabel>
										<Select onValueChange={field.onChange} defaultValue={field.value}>
											<FormControl>
												<SelectTrigger className="bg-secondary border-primary/30 text-primary">
													<SelectValue />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="low">LOW</SelectItem>
												<SelectItem value="medium">MEDIUM</SelectItem>
												<SelectItem value="high">HIGH</SelectItem>
												<SelectItem value="critical">CRITICAL</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="deadline"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="hud-text text-sm">DEADLINE</FormLabel>
										<FormControl>
											<Input type="date" className="bg-secondary border-primary/30 text-primary" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className="flex gap-3">
							<Button type="submit" className="tactical-button">CREATE_MISSION</Button>
							<Button type="button" variant="outline" className="border-muted text-muted-foreground" onClick={() => navigate(-1)}>
								CANCEL
							</Button>
						</div>
					</form>
				</Form>
			</HUDPanel>
		</div>
	);
};

export default CreateMission;