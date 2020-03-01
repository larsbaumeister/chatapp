import React, { FunctionComponent, useState } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import ProfileEdit from '../components/ProfileEdit'
import FriendList from '../components/FriendList'

type ProfilePageProps = {
    
}

type ProfilePageState = {
    id: number,
    firstName: string,
    lastName: string,
    birthday: string,
    email: string,
    username: string,
    password: string
}

const PROFILE_QUERY = gql`
    query($userId: Int!) {
        users(id: $userId) {
            id
            firstName
            lastName
            birthday
            username
            email
            friends {
                firstName
                lastName
            }
        }
    }
`

const PROFILE_MUTATION = gql`
    mutation registerUser($user: UserRegisterInput) {
        registerUser(user: $user) {
            firstName
            lastName
        }
    }
`

const ProfilePage: FunctionComponent<ProfilePageProps> = (props: any) => {
    const userId = Number(props.match.params.userId)

    const [state, setState] = useState<ProfilePageState>({
        id: 0,
        firstName: '',
        birthday: '',
        email: '',
        lastName: '',
        username: '',
        password: ''
    })

    let { loading, error, data } = useQuery(PROFILE_QUERY, { 
        variables: { userId },
        onCompleted: (data) => { 
            const user = data.users[0]
            setState({...user})
        }
    })

    const [updateUser, vars] = useMutation(PROFILE_MUTATION)
    error = error || vars.error
    loading = loading || vars.loading

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
    const user = data.users[0]

    const onChange = (propName: string, propValue: any) => {
        setState({
            ...state,
            [propName]: propValue
        })
    }

    const onSave = () => {
        const user: any = {
            ...state
        }
        delete user.friends
        delete user.__typename
        updateUser({
            variables: { user }
        })
    }
 
    return (
        user 
        ?
            <div>
                <ProfileEdit {...state} onPropChange={onChange} onSave={onSave} />
                <FriendList friends={user?.friends} />
            </div>
        :
            <div>
                User not found!
            </div>
    )
}

export default ProfilePage