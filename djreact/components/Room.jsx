import React from 'react';
import PropTypes from 'prop-types'

class Room extends React.Component {
    constructor( props ) {
        super( props )
    }
    componentDidMount() {

    }
    _pushNode(nodes, item, name, id, open){
        nodes.push(
            <div key={id + '_chatheads'}
                data-toggle={!open && 'dropdown'}
                className="room drop-shadow-lt"
                style={{ padding: '5px', marginBottom: '3px' }}>
                <img className="n_img_round low-opac"
                    data-toggle={!open && 'dropdown'}
                    src={item.profile.profile_image}>
                </img>
                <span className={!open ? ( 'lo-white lobster border-sm' ) : 'lobster lo-white border-md'}
                    data-toggle={!open && 'dropdown'}
                    style={{ marginLeft: '4px', lineHeight: '2.2em' }}>{name}
                </span>
                <ul className="dropdown-menu" style={{ textAlign: 'center' }} role="menu">
                    <li onClick={!open ? this.props.onClick : undefined}>{!open ? 'Open Chat' : 'Close Chat'} </li>
                </ul>
            </div> )
    }
    render() {
        let nodes = []
        let { friend, name, users, open } = this.props
        if ( friend !== undefined ) {
            this._pushNode(nodes,friend.to_user,name, friend.id, open)
        } else {
            for ( var i = 0; i < users.length; i++ ) {
                this._pushNode(nodes, users[i], name,users[i].id, open);
            }
        }

        return (
            <div className="dropdown dropdown-toggle" key={'room_' + name}>
                {nodes}
            </div>
        )
    }
}
Room.propTypes = {
    friend: PropTypes.object,
    name: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    users: PropTypes.array,
    active: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
};

export default Room;
