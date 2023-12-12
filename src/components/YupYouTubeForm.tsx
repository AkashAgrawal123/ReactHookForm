import './YouTubeForm.scss';
import { useForm } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({
    username: yup.string().required('username is required'),
    email: yup.string().email('Email format is not valid').required('email is required'),
    channel: yup.string().required('channel is required'),
    rememberme: yup.boolean().oneOf([true], 'you must check the checkbox'),
    subscription: yup.string().required('Please select a button'),
})

type FormValues = {
    username: string;
    email: string;
    channel: string;
    rememberme: boolean;
    subscription: string;
}

const YupYouTubeForm = () => {
    const form = useForm({
        defaultValues: {
            username: '',
            email: '',
            channel: '',
            rememberme: false,
            subscription: '',
        },
        resolver: yupResolver(schema)
    });

    const { register, control, handleSubmit, formState, reset } = form;
    const { errors, isSubmitSuccessful } = formState;

    const onSubmit = (data: FormValues) => {
        console.log('submitted', data);

        if (isSubmitSuccessful) {
            reset();
        }
    }

    return (
        <div className="form-div">
            <h1>Yup...</h1>
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

                <div className='form-control'>
                    <input type='checkbox' id='rememberme' {...register('rememberme')} />
                    <label>Remember me</label>
                    <p className='error'>{errors.rememberme?.message}</p>
                </div>
                <div className='form-control'>
                    <label>Please select a button</label>
                    <label>
                        <input type='radio' {...register('subscription')} value='free' />Free
                    </label>
                    <label>
                        <input type='radio' {...register('subscription')} value='Premium' />Premium
                    </label>
                    <label>
                        <input type='radio' {...register('subscription')} value='pro' /> Pro
                    </label>
                    <p className='error'>{errors.subscription?.message}</p>
                </div>
                <button>Submit</button>
            </form>
            <DevTool control={control} />
        </div>
    );
};

export default YupYouTubeForm;

// it's recommended to do not use 'reset' method inside the onSubmit method. instead of that we can use
//  it in isSubmitSuccessful.