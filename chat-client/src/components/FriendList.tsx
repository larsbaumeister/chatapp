import React, { FunctionComponent } from 'react'

type FriendListProps = {
    friends: [any]
}

const FriendList: FunctionComponent<FriendListProps> = (props) => {
    return (
        <div>
            <h3>These are your friends: </h3>
            <ul>
                { props.friends?.map((f: any, idx: number) => <li key={idx}>{f.firstName + ' ' + f.lastName}</li>) }
            </ul>
        </div>
    )
}

export default FriendList