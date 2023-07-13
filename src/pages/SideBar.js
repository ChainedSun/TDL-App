import './SideBar.css';

function SideBar(args) {
    const {user, onSignOut} = args

    return ( 
        <div className="sidebar">
            <div className='login-info'>
                <p className='user-name'>Welcome, {user?.displayName}</p>
                <img className="profile-picture" src={`${user?.photoURL}`}></img>
                <button className='signout-btn' onClick={onSignOut}>Sign Out</button>
            </div>
        </div>
    );
}

export default SideBar;