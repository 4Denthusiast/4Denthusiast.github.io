var videosNode = document.getElementById("videos");

[
    {
        title:"TASTE TESTING ANANKE CANAPÉS",
        alt:"a plate containing 3 canapés",
        img:"canapés.png",
        desc:"Kendall & co. try out the historic conference's nibbles taken using the first run of the CHRONOS machine."
    },
    {
        title:"XANTHE AND TULIP POST-MORTEM INTERVIEW",
        alt:"Kendall posing with one of the singers",
        img:"singers.png",
        desc:"I go into the past and pose viewer-submitted questions to the long-dead singers we've all been missing so dearly."
    },
    {
        title:"EXPERIMENTAL ANTI-ZIDAR STEALTH TECHNIQUE",
        img:"zidar.png",
        alt:"Waves, representing ZIDAR, passing straight through a spaceship outline",
        desc:"The Indulgence gets another upgrade: invisibility to ZIDAR when sub-light-speed. Could this have implications for the mysterious disappearance of the Ananke from ZIDAR?"
    },
    {
        title:"UPCOMING CHRONOS CONFERENCE",
        img:"ananke.png",
        alt:"The Ananke space-station",
        desc:"I managed to get an exclusive invitation to a SECRET CONFERENCE where we will be MEDDLING WITH HISTORY!"
    },
    {
        title:"BEHIND THE SCENES!",
        img:"backstage.png",
        alt:"A cameraman pointing a large film-camera at Kendall",
        desc:"See all the hidden work that goes into making one of my videos, and meet the team-members that don't often end up on-screen."
    }
].forEach(dat => {
    var vid = document.createElement("div");
    vid.innerHTML = "<img class=\"thumbnail\"><div class=\"videoText\"><span></span><span></span></div>"
    vid.classList = "videoLink";
    vid.children[0].alt = dat.alt;
    vid.children[0].src = "thumbnails/"+dat.img;
    vid.children[1].children[0].textContent = dat.title;
    vid.children[1].children[1].textContent = dat.desc;
    videosNode.append(vid);
});

Array.prototype.forEach.call(document.getElementsByTagName("a"), a => a.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ");
