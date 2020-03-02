import React, { FunctionComponent, ChangeEvent, MouseEvent } from 'react'
import './ProfileEdit.css'
import TextInput from './TextInput'

type ProfileEditProps = {
    firstName: string,
    lastName: string,
    email: string,
    birthday: string,
    username: string,
    password: string,
    onPropChange: (propName: string, propValue: any) => void,
    onSave: () => void,
    saveButtonText?: string
}


const ProfileEdit: FunctionComponent<ProfileEditProps> = (props) => {

    const onChange = (evt: ChangeEvent<HTMLInputElement>) => {
        evt.preventDefault()
        props.onPropChange(evt.target.name, evt.target.value)
    }
    
    return (
        <div className='profile-page'>
            <form>
                <TextInput label='Username' name='username' value={props.username} onChange={onChange} />
                <TextInput label='EMail' type='email' name='email' value={props.email} onChange={onChange} />
                <TextInput label='Firstname' name='firstName' value={props.firstName} onChange={onChange} />
                <TextInput label='Lastname' name='lastName' value={props.lastName} onChange={onChange} />
                <TextInput label='Birthday' name='birthday' value={props.birthday} onChange={onChange} />
                <TextInput label='Password' name='password' value={props.password} onChange={onChange} type='password' />
                <div className='profile-save-button-wrapper'><button onClick={evt => {evt.preventDefault(); props.onSave();} } >{props.saveButtonText}</button></div>
            </form>
        </div>
    )
}

ProfileEdit.defaultProps = {
    saveButtonText: 'Save'
}

export default ProfileEdit