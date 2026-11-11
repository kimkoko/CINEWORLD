const CINE = (() => {
  const movies = [
    {
      id: "courier",
      title: "The Courier",
      poster: "img/poster1.jpg",
      age: 15,
      genre: "Thriller",
      runtime: 112,
      director: "Dominic Cooke",
      cast: "Benedict Cumberbatch, Merab Ninidze, Rachel Brosnahan",
      synopsis: "A British salesman is asked to carry messages into Cold War Moscow. The job is meant to look ordinary, and that is exactly what makes it dangerous.",
      trailer: "oeYElSu3gEc",
      release: "2021. 03. 19"
    },
    {
      id: "minari",
      title: "Minari",
      poster: "img/poster2.jpg",
      age: 12,
      genre: "Drama",
      runtime: 115,
      director: "Lee Isaac Chung",
      cast: "Steven Yeun, Han Ye-ri, Youn Yuh-jung",
      synopsis: "A Korean American family starts a farm in Arkansas. When the grandmother arrives, the house gets louder, funnier, and harder to hold together.",
      trailer: "KQ0gFidlro8",
      release: "2021. 03. 03"
    },
    {
      id: "soul",
      title: "Soul",
      poster: "img/poster3.jpg",
      age: 7,
      genre: "Animation",
      runtime: 100,
      director: "Pete Docter",
      cast: "Jamie Foxx, Tina Fey, Questlove",
      synopsis: "A band teacher finally gets his big gig, then wakes up somewhere souls are given their spark. Getting back to the stage means figuring out what the gig was for.",
      trailer: "xOsLIiBStEs",
      release: "2021. 01. 20"
    },
    {
      id: "wind",
      title: "Gone with the Wind",
      poster: "img/poster4.jpg",
      age: 12,
      genre: "Classic",
      runtime: 238,
      director: "Victor Fleming",
      cast: "Vivien Leigh, Clark Gable, Olivia de Havilland",
      synopsis: "A re-release of the Civil War epic. Scarlett O'Hara keeps rebuilding her life as the world around her comes apart.",
      trailer: null,
      release: "1939. 12. 15"
    },
    {
      id: "rainy",
      title: "Story of Rainy Days",
      poster: "img/poster5.jpg",
      age: 12,
      genre: "Romance",
      runtime: 117,
      director: "Jo Seon-ho",
      cast: "Kang Ha-neul, Chun Woo-hee",
      synopsis: "A young man in Seoul and a young woman in Busan trade a story that only makes sense in the rain. Also known as Waiting for Rain.",
      trailer: null,
      release: "2021. 04. 28"
    },
    {
      id: "cruella",
      title: "Cruella",
      poster: "img/poster6.jpg",
      age: 15,
      genre: "Crime",
      runtime: 134,
      director: "Craig Gillespie",
      cast: "Emma Stone, Emma Thompson, Joel Fry",
      synopsis: "An ambitious designer in 1970s London turns a grudge against a fashion house into a very public alter ego.",
      trailer: null,
      release: "2021. 05. 26"
    },
    {
      id: "young",
      title: "Young Adult Matters",
      poster: "img/poster7.jpg",
      age: 18,
      genre: "Drama",
      runtime: 127,
      director: "Lee Hwan",
      cast: "Lee Yoo-mi, Ahn Hee-yeon, Shin Haet-bit",
      synopsis: "Runaway teenagers share a room, a secret, and a plan that the adults around them refuse to look at directly.",
      trailer: null,
      release: "2021. 04. 15"
    },
    {
      id: "conan",
      title: "Detective Conan",
      poster: "img/poster8.jpg",
      age: 7,
      genre: "Animation",
      runtime: 110,
      director: "Yuzuru Tachikawa",
      cast: "Minami Takayama, Wakana Yamazaki, Rikiya Koyama",
      synopsis: "Zero the Enforcer. A bombing case pulls Conan toward the public security side of the police, and the suspect is closer to the law than he looks.",
      trailer: null,
      release: "2018. 04. 13"
    },
    {
      id: "flipped",
      title: "Flipped",
      poster: "img/poster9.jpg",
      age: 12,
      genre: "Romance",
      runtime: 90,
      director: "Rob Reiner",
      cast: "Madeline Carroll, Callan McAuliffe, Rebecca De Mornay",
      synopsis: "She liked him first. He took years to catch up. A small-town story about the same summer told from both sides of the fence.",
      trailer: null,
      release: "2010. 08. 06"
    },
    {
      id: "marksman",
      title: "The Marksman",
      poster: "img/poster10.jpg",
      age: 15,
      genre: "Action",
      runtime: 108,
      director: "Robert Lorenz",
      cast: "Liam Neeson, Jacob Perez, Katheryn Winnick",
      synopsis: "A rancher on the Arizona border agrees to drive a boy north, and the men looking for the boy do not stop at the state line.",
      trailer: null,
      release: "2021. 01. 21"
    }
  ];

  const theaters = [
    { id: "dogok", name: "Dogok" },
    { id: "gangdong", name: "Gangdong" },
    { id: "gangnam", name: "Gangnam" },
    { id: "hongdae", name: "Hongdae Univ" },
    { id: "jangan", name: "Jangan" },
    { id: "nowon", name: "Nowon" },
    { id: "sindorim", name: "Sindorim" },
    { id: "yongsan", name: "Yongsan" },
    { id: "ilsan", name: "Ilsan" }
  ];

  const charts = {
    now: ["courier", "minari", "soul", "wind"],
    soon: ["rainy", "cruella", "young", "conan"],
    recent: ["minari", "flipped", "wind", "marksman"]
  };

  const events = [
    {
      id: 8,
      title: "Winter Classic Week",
      author: "ADMIN",
      date: "2026. 11. 02",
      image: "img/event2.jpeg",
      movieId: "wind",
      body: "Gone with the Wind and Flipped stay on the recent-release chart through November. Each lobby has a printed program with running times, so you can plan around the long cut. No extra charge on top of the ticket."
    },
    {
      id: 7,
      title: "Ilsan lobby photo spot",
      author: "ADMIN",
      date: "2026. 11. 01",
      image: "img/event4.jpeg",
      movieId: null,
      body: "The Ilsan branch kept the opening photo wall in the lobby. Bring a ticket for any screening this month and staff will take one photo on the house camera. Prints are ready before the credits."
    },
    {
      id: 6,
      title: "[Flipped] Re-released Event",
      author: "ADMIN",
      date: "2021. 04. 26",
      image: "img/event1.jpeg",
      movieId: "flipped",
      body: "Flipped is back on a limited run. The first screening of the day at Yongsan and Hongdae Univ includes the original soundtrack booklet while supplies last. Online seats are the same price as a regular ticket."
    },
    {
      id: 5,
      title: "[Gone with the Wind] Re-released Event",
      author: "ADMIN",
      date: "2021. 04. 26",
      image: "img/event2.jpeg",
      movieId: "wind",
      body: "The re-release plays with an intermission built into the showtime. There is a fifteen-minute break in the middle, and the seat you booked is held. Arrive early — this cut runs just under four hours."
    },
    {
      id: 4,
      title: "Get a discount with VISA card!",
      author: "ADMIN",
      date: "2021. 04. 25",
      image: "img/event3.jpeg",
      movieId: null,
      body: "Pay with a VISA card at the box office window and the counter takes 10% off paper tickets and concession combos. Online bookings on this site stay at the regular seat price. The window discount is not applied again at the door."
    },
    {
      id: 3,
      title: "Grand Opening - Ilsan branch",
      author: "ADMIN",
      date: "2021. 04. 13",
      image: "img/event4.jpeg",
      movieId: null,
      body: "CINEWORLD Ilsan is open, with four screens and the same chart as the Seoul branches. Opening week keeps one screen for classics in the afternoon and new releases at night. Ilsan is in the branch list when you book."
    },
    {
      id: 2,
      title: "Speech and Drama for Young Artists",
      author: "ADMIN",
      date: "2021. 04. 07",
      image: "img/event4.jpeg",
      movieId: null,
      body: "A weekend workshop in the Gangnam lobby for students who want to try a short scene on camera. The session is free for anyone holding a CINEWORLD ticket from the same week. Ask the information desk to hold a seat."
    },
    {
      id: 1,
      title: "The Art of Short film Making",
      author: "ADMIN",
      date: "2021. 04. 01",
      image: "img/event4.jpeg",
      movieId: null,
      body: "Three short films from local students play before the last screening at Sindorim on the first Wednesday of the month. The short program is included with that showtime. Book the late screening if you want to stay for the discussion after."
    }
  ];

  const price = 12000;
  const rows = "ABCDEFGH";
  const cols = 12;

  function movie(id) {
    return movies.find((item) => item.id === id) || null;
  }

  function theater(id) {
    return theaters.find((item) => item.id === id) || null;
  }

  function event(id) {
    return events.find((item) => item.id === Number(id)) || null;
  }

  function chart(name) {
    return (charts[name] || []).map((id, index) => ({ ...movie(id), rank: index + 1 }));
  }

  function hash(value) {
    let h = 2166136261;
    const text = String(value);
    for (let i = 0; i < text.length; i += 1) {
      h ^= text.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function upcomingDates(count = 7) {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const dates = [];
    for (let i = 0; i < count; i += 1) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      const month = String(day.getMonth() + 1).padStart(2, "0");
      const date = String(day.getDate()).padStart(2, "0");
      dates.push({
        iso: `${day.getFullYear()}-${month}-${date}`,
        label: day.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
      });
    }
    return dates;
  }

  function shows(movieId, theaterId, date) {
    const slots = ["10:10", "12:40", "15:20", "17:50", "20:30"];
    const seed = hash(`${movieId}|${theaterId}|${date}`);
    const count = 3 + (seed % 2);
    const offset = seed % 2;
    const list = [];
    for (let i = 0; i < count; i += 1) {
      list.push({
        time: slots[offset + i],
        screen: ((seed >>> (i * 3)) % 4) + 1
      });
    }
    return list;
  }

  function showKey(show) {
    return [show.movieId, show.theaterId, show.date, show.time, show.screen].join("|");
  }

  function seedSold(key) {
    let x = hash(key) || 1;
    const sold = [];
    for (const row of rows) {
      for (let col = 1; col <= cols; col += 1) {
        x = (Math.imul(x, 1664525) + 1013904223) >>> 0;
        if (x % 100 < 32) sold.push(row + col);
      }
    }
    return sold;
  }

  function money(amount) {
    return `₩${amount.toLocaleString("ko-KR")}`;
  }

  function formatDate(iso) {
    const [year, month, day] = iso.split("-").map(Number);
    return new Date(year, month - 1, day).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  }

  function runtimeLabel(minutes) {
    return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  }

  function sortSeats(list) {
    return list.slice().sort((a, b) => {
      if (a[0] !== b[0]) return a[0] < b[0] ? -1 : 1;
      return parseInt(a.slice(1), 10) - parseInt(b.slice(1), 10);
    });
  }

  return {
    movies,
    theaters,
    events,
    charts,
    price,
    rows,
    cols,
    movie,
    theater,
    event,
    chart,
    upcomingDates,
    shows,
    showKey,
    seedSold,
    money,
    formatDate,
    runtimeLabel,
    sortSeats
  };
})();
