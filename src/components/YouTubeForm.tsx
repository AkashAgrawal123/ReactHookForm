import './YouTubeForm.scss';
import { useForm, useFieldArray, FieldErrors } from 'react-hook-form';
import { DevTool } from '@hookform/devtools'
import { useEffect } from 'react';

let renderCount = 0;

type FormValues = {
  username: string;
  email: string;
  name: string;
  channel: string;
  social: {
    twitter: string;
    facebook: string;
  },
  phoneNumbers: string[];
  phNumbers: {
    number: string;
  },
  age: number;
  dob: Date;
}

const YouTubeForm = () => {
  // const form = useForm<FormValues>({
  const form = useForm({  //we dont need to specify <FormValues> while invoking useForm hook.
    defaultValues: {
      username: 'Batman',
      email: '',
      name: '',
      channel: '',
      social: {
        twitter: '',
        facebook: ''
      },
      phoneNumbers: ["", ""],
      phNumbers: [{ number: '' }],
      age: 0,
      dob: new Date()
    },  // this is static form of setting default values. now let's do through the API.

    // mode: 'onBlur' //this is a mode to check whether any reuired is available. we have so many things to check like 'onTouched', 'onSubmit','onChange'
    // mode: 'onTouched'
    // mode: 'onChange'
    mode: 'all' // it will check or work for all above mentioned methods.

    // defaultValues: async () => {
    //   const response = await fetch('https://jsonplaceholder.typicode.com/users/1');
    //   const data = await response.json();
    //   return {
    //     username: 'Batman',
    //     email: data.email,
    //     channel: ''
    //   }
    // } // this is the way to set the values through the API call.
  });
  const { register, control, handleSubmit, formState, watch, getValues, setValue, reset, trigger } = form;
  // const { name, ref, onChange, onBlur } = register('username');
  const { errors, touchedFields, dirtyFields, isDirty, isValid, isSubmitting, isSubmitted, isSubmitSuccessful, submitCount } = formState;
  console.log({ touchedFields, dirtyFields, isDirty, isValid, isSubmitting, isSubmitted, isSubmitSuccessful, submitCount }, 'tocuhed');

  const { fields, append, remove } = useFieldArray({
    name: 'phNumbers',
    control
  })

  const onSubmit = (data: FormValues) => {
    console.log('submitted', data);
  }

  const onError = (errors: FieldErrors<FormValues>) => {
    console.log('error', errors);
  }

  useEffect(() => {
    const subscription = watch((value) => {
      console.log(value);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // const watchUserName = watch('username');
  // const watchUserName = watch();

  // const handleGetValues = () => {
  //   console.log(getValues(['username', 'email']), 'getValues'); // getValues is to check when the specific or particular things you want to check.
  // }

  const handleSetValue = () => {
    setValue('username', '', {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true
    });
  }

  // if we want to auto reset the form after submit.
  useEffect(() => {
    if (isSubmitSuccessful) {
      reset()
    }
  }, [isSubmitSuccessful, reset])

  renderCount++;
  return (
    <div className="form-div">
      <h1>Rendering... ({renderCount / 2})</h1>
      {/* <h2>watchValue: {watchUserName}</h2> */}
      {/* <h2>watchValue: {JSON.stringify(watchUserName)}</h2> */}
      <form className="form" onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        <div className="form-control">
          <label htmlFor="username">Username</label>
          {/* <input type="text" id="username" name={name} ref={ref} onChange={onChange} onBlur={onBlur} /> */}
          <input type="text" id="username" disabled {...register('username', {
            // required: 'Username is required'
            required: {
              value: true,
              message: 'Username is required'
            }
          })} />
          <p className="error">{errors.username?.message}</p>
        </div>
        <div className="form-control">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" {...register("email", {
            pattern: {
              value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
              message: 'Invalid email',
            },
            // validate: (fieldValue) => {
            //   return (
            //     fieldValue !== "admin@example.com" || 'Enter a diff email'
            //   );
            // },
            validate: {
              notAdmin: (fieldValue) => {
                return (
                  fieldValue !== "admin@example.com" || 'enter diff email address'
                )
              },
              notBlackListed: (fieldValue) => {
                return (!fieldValue.endsWith('baddomain.com') || "this domain is not supported");
              },
              emailAvailable: async (fieldValue) => {
                const response = await fetch(`https://jsonplaceholder.typicode.com/users?email=${fieldValue}`);
                const data = await response.json();
                return data.length == 0 || 'Email already exist';
              }
            }
          })}
          />
          <p className="error">{errors.email?.message}</p>
        </div>
        <div className="form-control">
          <label htmlFor="name">Name</label>
          <input type="text" id="name" {...register('name', {
            required: {
              value: true,
              message: 'Name is required'
            }
          })} />
          <p className="error">{errors.name?.message}</p>
        </div>
        <div className="form-control">
          <label htmlFor="channel">Channel</label>
          <input type="text" id="channel" {...register('channel', {
            required: {
              value: true,
              message: 'Channel name is required'
            }
          })} />
          <p className="error">{errors.channel?.message}</p>
        </div>

        <div className="form-control">
          <label htmlFor="twitter">Twitter</label>
          <input type="text" id="twitter" {...register('social.twitter', {
            disabled: true,
            required: 'Enter twitter'
          })} />
        </div>

        <div className="form-control">
          <label htmlFor="facebook">Facebook</label>
          <input type="text" id="facebook" {...register('social.facebook')} />
        </div>

        <div className="form-control">
          <label htmlFor="primary-phone">Primary Phone number</label>
          <input type="text" id="primary-phone" {...register('phoneNumbers.0')} />
        </div>

        <div className="form-control">
          <label htmlFor="secondary-phone">Secondary Phone number</label>
          <input type="text" id="secondary-phone" {...register('phoneNumbers.1')} />
        </div>

        <div>
          <label>List of phone numbers</label>
          <div>
            {fields.map((field, index) => {
              return (
                <div className='form-control' key={field.id}>
                  <input type='text'
                    {...register(`phNumbers.${index}.number` as const)} />
                  {index > 0 && (
                    <button type='button' onClick={() => remove(index)}>Remove phone number</button>
                  )}
                </div>
              )
            })}
            <button type='button' onClick={() => append({ number: '' })}>Add phone number</button>
          </div>
        </div>

        <div className="form-control">
          <label htmlFor="age">Age</label>
          <input type="number" id="age" {...register('age', {
            valueAsNumber: true,
            required: {
              value: true,
              message: 'Age is required'
            }
          })} />
          <p className="error">{errors.age?.message}</p>
        </div>

        <div className="form-control">
          <label htmlFor="dob">Date of birth</label>
          <input type="date" id="dob" {...register('dob', {
            valueAsDate: true,
            required: {
              value: true,
              message: 'Date of birth is required'
            }
          })} />
          <p className="error">{errors.dob?.message}</p>
        </div>
        {/* <button>Submit</button> */}
        {/* <button disabled={!isDirty || !isValid|| isSubmitting}>Submit</button> */}
        <button disabled={!isDirty || isSubmitting}>Submit</button>
        {/* this is for getValues button to get ot trigger the specific item */}
        {/* <button type="button" onClick={handleGetValues}>Get Values</button> */}
        <button type='button' onClick={() => reset()}>Reset</button>
        <button type='button' onClick={handleSetValue}>Set value</button>

        {/* by writing the below one it will cehck and trigger all required field */}
        <button type='button' onClick={() => trigger()}>Validate</button> 

        {/* by writing the below one it will check and it will trigger specific field */}
        <button type='button' onClick={() => trigger('channel')}>Validate</button>
      </form>
      <DevTool control={control} />
    </div>
  );
};

export default YouTubeForm;

// it's recommended to do not use 'reset' method inside the onSubmit method. instead of that we can use
//  it in isSubmitSuccessful.