import React from "react";

const progress_bar = [];

for (let i=0; i<=21; i++) {
  progress_bar.push(
    <img style={{width:'100%'}} src={'/charcount/img/progress_bar/'+i+'-min.png'} alt={''}/>
  );
}

export {progress_bar};

export const saveIcon = <img className='saveIcon' src={'/charcount/img/saveIcon.png'} alt={''}/>;
export const logo = <img style={{height: 'auto', width: 'auto'}} src={'/charcount/img/logocharcount.png'} alt={''}/>;
export const disconnectIcon = <img style={{height: '100%', width: '100%'}} src={'/charcount/img/disconnect.png'} alt={''}/>;
