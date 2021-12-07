require( '../scss/style.scss' );

let max;
let data;
let player;
let isPlaying;
let scaler = 20;

const bg = document.getElementById( 'wrap' );
const audio = document.getElementById( 'audio' );
const loader = document.getElementById( 'loading' );
const style = document.createElement( 'style' );
document.head.appendChild( style );

const getAudio = ( url, audioContext ) => {
  fetch( url )
    .then( response => response.arrayBuffer() )
    .then( arrayBuffer => audioContext.decodeAudioData( arrayBuffer ) )
    .then( audioBuffer => {
      onReady( audioBuffer );
    });
};

const ripData = audioBuffer => {
  const rawData = audioBuffer.getChannelData( 0 );
  max = audio.duration * 10;

  const blockSize = Math.floor( rawData.length / max );
  const filteredData = [];
  for( let i = 0; i < max; i++ ) {
    let blockStart = blockSize * i;
    let sum = 0;
    for( let j = 0; j < blockSize; j++ ) {
      sum = sum + Math.abs( rawData[ blockStart + j ] );
    }
    filteredData.push( sum / blockSize ); 
  }
  return filteredData.filter( piece => ! isNaN( piece ) );
};

const normalizeData = filteredData => {
  const multiplier = Math.pow( Math.max( ...filteredData ), -1 );
  return filteredData.map( n => n * multiplier );
}

const onDraw = () => {
  if( ! isPlaying ) {
    return;
  }
  const { currentTime } = audio;
  let curTime = currentTime.toFixed( 1 );
  curTime = curTime.replace( '.', '' );
  curTime = parseInt( curTime, 10 );

  if( curTime < max && data[ curTime ] ) {
    const fixed = data[ curTime ].toFixed( 2 );
    const blur = parseFloat( fixed, 10 ) * scaler;
    const adjustedBlur = Math.max( blur, 0 );
    bg.style.filter = `blur(${ adjustedBlur }px) brightness(5)`;
    style.innerHTML = `
      #wrap:after {background: repeating-conic-gradient(from 235deg, #000, transparent ${ adjustedBlur * 5 }deg)};
      #wrap:before {background: repeating-radial-gradient(circle, transparent, #000 ${adjustedBlur * 5}}%)};
    `;
  }
  window.requestAnimationFrame( onDraw );
};

const onEnded = () => {
  bg.classList.remove( 'run' );
  bg.addEventListener( 'click', onClick );
};

const onReady = audioBuffer => {
  if( ! data ) { 
    data = normalizeData( ripData( audioBuffer ) );
  }
  loader.classList.remove( 'show' );
  bg.classList.add( 'run' );
  window.requestAnimationFrame( onDraw );
};

const onPlay = () => {
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  const audioContext = new AudioContext();
  if( ! data ) {
    getAudio( audio.src, audioContext );
  } else {
    onReady();
  }
};

window.onStateChange = e => {
  if( e.data === YT.PlayerState.PLAYING ) {
    if( ! isPlaying ) {
      isPlaying = true;
      onPlay();
    }
  }
  if ( e.data === YT.PlayerState.ENDED ) {
    isPlaying = false;
    onEnded();
  }
};

const onClick = () => {
  bg.removeEventListener( 'click', onClick );
  bg.style.opacity = 0;
  loader.classList.add( 'show' );
  player.playVideo();
  audio.play();
};

const onResize = () => {
  if( window.innerWidth > window.innerHeight ) {
    bg.classList.remove( 'reverse' );
  } else {
    bg.classList.add( 'reverse' );
  }
};

window.onReady = e => {
  player = e.target;
  player.setVolume( 0 ); 
  onResize();
  bg.classList.add( 'ready' );
  window.addEventListener( 'resize', onResize );
  bg.addEventListener( 'click', onClick );
  bg.style.opacity = 1;
};
