let currentSong = new Audio();
let songs;
let currFolder;

function secondsTominsec(num) {
  let min = Math.floor(num / 60); // Get the integer part of minutes
  let sec = Math.floor(num % 60); // Get the integer part of seconds
  return `${min.toString().padStart(2, "0")}:${sec
    .toString()
    .padStart(2, "0")}`; // Add leading zeros
}

async function getSongs(folder) {
  currFolder = folder;
  let a = await fetch(`https://vibhagupta8102.github.io/Gungunao/albums/${folder}/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element);
    }
  }

  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  songUL.innerHTML = "";
  for (const song of songs) {
    songUL.innerHTML += ` <li class="m-5 p-5 flex  items-center" data-href=${
      song.href
    }>
              <img src="svgs/music.svg" alt="" />
              <div class="Song-name">${song.title.split(".")[0]}</div>
              <img src="svgs/play.svg" alt="play now" class="invert"/>
            </li>`;
  }
  playMusic(songs[0].title.split(".")[0], true);

  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", () => {
      playMusic(e.querySelector("div").innerHTML);
    });
  });
}

const playMusic = (track, pause = false) => {
  currentSong.src = `/albums/${currFolder}/` + track + ".mp3";
  if (!pause) {
    currentSong.play();
    play.src = "svgs/pause.svg";
  }

  document.querySelector(".songinfo").innerHTML = decodeURI(track);
};

async function displayAlbums() {
  let a = await fetch("https://vibhagupta8102.github.io/Gungunao/albums/");
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;

  let anchors = div.getElementsByTagName("a");
  let cardContainer = document.querySelector(".cardContainer");
  let array = Array.from(anchors);
  for (let index = 0; index < array.length; index++) {
    const e = array[index];
    if (e.href.includes("/albums/")) {
      // console.log(e);
      let folder = e.href.split("/").slice(-1)[0];
      // console.log(folder);
      let a = await fetch(`https://vibhagupta8102.github.io/Gungunao/albums/${folder}/info.json`);
      let response = await a.json();
      cardContainer.innerHTML += ` <div class="card rounded bg-medium flex gap" data-folder=${folder}>
              <div class="play">
                <img src="svgs/cardplay.svg" alt="cardplay" />
              </div>
              <img src="happy img.webp" alt="album-cover" />
              <h2>${response.title}</h2>
              <p>${response.description}</p>
            </div>
`;
    }
  }
}

async function main() {
  await getSongs("songs1");

  await displayAlbums();

  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async () => {
      await getSongs(`${e.dataset.folder}`);
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

    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let clickedPercent =
      (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = clickedPercent + "%";
    currentSong.currentTime = (clickedPercent * currentSong.duration) / 100;
  });

  document.querySelector(".hamburger").addEventListener("click", (e) => {
    document.querySelector(".left").style.left = 0;
  });

  document.querySelector(".close").addEventListener("click", (e) => {
    document.querySelector(".left").style.left = -120 + "%";
  });

  previous.addEventListener("click", () => {
    // Find the current song in the songs array
    let currentTrack = decodeURI(
      currentSong.src.split("/").pop().split(".")[0]
    );
    let currentIndex = songs.findIndex(
      (song) => song.title.split(".")[0] === currentTrack
    );
    // Decrement the index and loop back to the first song if at the end
    let previousIndex = (currentIndex - 1) % songs.length;
    if (previousIndex >= 0) {
      // Play the next song
      playMusic(songs[previousIndex].title.split(".")[0]);
    }
  });
  next.addEventListener("click", () => {
    // Find the current song in the songs array
    let currentTrack = decodeURI(
      currentSong.src.split("/").pop().split(".")[0]
    );
    let currentIndex = songs.findIndex(
      (song) => song.title.split(".")[0] === currentTrack
    );
    // Increment the index and loop back to the first song if at the end
    let nextIndex = (currentIndex + 1) % songs.length;

    // Play the next song
    playMusic(songs[nextIndex].title.split(".")[0]);
  });

  volume.addEventListener("change", (e) => {
    currentSong.volume = e.target.value / 100;
  });

  volumesvg.addEventListener("click", (e) => {
    if (e.target.src.includes("volume.svg")) {
      currentSong.pause();
      currentSong.volume = 0;
      e.target.src = "svgs/mute.svg";
      volume.value = 0;
    } else {
      currentSong.volume = 0.5;
      currentSong.play();
      volume.value = 50;
      e.target.src = "svgs/volume.svg";
    }
  });
}
main();
