import React from "react"

export default class RemovePost extends React.Component {
  handleClick = (e) => {
  console.log(this.props.value)
    this.props.onClick(e,this.props.index,this.props.value);
  }

  render() {
    return (
      <a onClick={this.handleClick} className={'postRemove'}>Remove Post</a>
    );
  }
}