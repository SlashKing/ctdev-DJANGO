import React from 'react'
import LeftSidebarComponent from '../components/LeftSideBarComponent'
export default class LeftSidebarContainer extends React.Component {
    constructor(props){
        super(props);
    }
  componentDidMount(){
  }
  componentDidUpdate(){
  }
  
  render() {
    const component = <LeftSidebarComponent {...this.props} />
    return (
      <div className="aside-flex">
            {component}
      </div>
    );
  }
}