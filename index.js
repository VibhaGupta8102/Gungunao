let currentSong = new Audio();

// function secondsTominsec(num) {
//   let min = num / 60;
//   let sec = num % 60;
//   return `${min}:${sec}`;
// }

function secondsTominsec(num) {
  let min = Math.floor(num / 60); // Get the integer part of minutes
  let sec = Math.floor(num % 60); // Get the integer part of seconds
  return `${min.toString().padStart(2, "0")}:${sec
    .toString()
    .padStart(2, "0")}`; // Add leading zeros
}

async function getSongs() {
  let a = await fetch("http://127.0.0.1:5500/songs/");
  let response = await a.text();
  //   console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element);
    }
    // console.log(element);
  }
  return songs;
}

const playMusic = (track, pause = false) => {
  // currentSong.pause();
  currentSong.src = "/songs/" + track + ".mp3";
  if (!pause) {
    currentSong.play();

    play.src = "svgs/pause.svg";
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
  }
  // document.querySelector(".songtime").innerHTML = "";
};

async function main() {
  songs = await getSongs();
  // console.log(songs);
  playMusic(songs[0], true);
  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  for (const song of songs) {
    songUL.innerHTML += ` <li class="m-5 p-5 flex  items-center" data-href=${
      song.href
    }>
                <img src="svgs/music.svg" alt="" />
                <div class="Song-name">${song.title.split(".")[0]}</div>
                <img src="svgs/play.svg" alt="play now" class="invert"/>
              </li>`;
  }

  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      console.log(e.querySelector("div").innerHTML);
      playMusic(e.querySelector("div").innerHTML);
    });
  });

  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "svgs/pause.svg";
    } else {
      currentSong.pause();
      play.src = "svgs/play.svg";
    }
  });

  currentSong.addEventListener("timeupdate", () => {
    // console.log(currentSong.currentTime, currentSong.duration);
    document.querySelector(".songtime").innerHTML = `${secondsTominsec(
      currentSong.currentTime
    )} / ${secondsTominsec(currentSong.duration)}`;
  });
}
main();
