import './YouTubeForm.scss';
import { useForm } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
    username: z.string().nonempty('zod username is required'),
    email: z.string().nonempty('zod Email is required').email('zod Email format is not valid'),
    channel: z.string().nonempty('zod Channel is required')
})

type FormValues = {
    username: string;
    email: string;
    channel: string;
}

const ZodYouTubeForm = () => {
    const form = useForm({
        defaultValues: {
            username: '',
            email: '',
            channel: '',
        },
        resolver: zodResolver(schema),
    });

    const { register, control, handleSubmit, formState } = form;
    const { errors } = formState;

    const onSubmit = (data: FormValues) => {
        console.log('submitted', data);
    }

    return (
        <div className="form-div">
            <h1>Zod...</h1>
            <form className="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="form-control">
                    <label htmlFor="username">Username</label>
                    <input type="text" id="username" {...register('username')} />
                    <p className="error">{errors.username?.message}</p>
                </div>
                <div className="form-control">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" {...register("email")} />
                    <p className="error">{errors.email?.message}</p>
                </div>

                <div className="form-control">
                    <label htmlFor="channel">Channel</label>
                    <input type="text" id="channel" {...register('channel')} />
                    <p className="error">{errors.channel?.message}</p>
                </div>

                <button>Submit</button>
            </form>
            <DevTool control={control} />
        </div>
    );
};

export default ZodYouTubeForm;