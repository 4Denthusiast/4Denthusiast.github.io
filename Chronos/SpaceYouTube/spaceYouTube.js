var videosNode = document.getElementById("videos");

[
    {
        title:"Cheimeros.4 under invasion",
        alt:"Cheimeros, seen from a distance.",
        desc:"Apparently I'm some sort of historian now. This is another video used to encourage people in the past to action: getting Cheimeros to surrender to Kedalion this time.",
        img:"Cheimeros4.png"
    },
    {
        title:"Achelia.3 under Klaycorp",
        alt:"Achelia, seen from a distance.",
        desc:"As I haven't had much time for my regular videos, I thought I'd show y'all some of the work I've been doing with the Chronos project. This video was given to the Tungsten Roses as a warning of how Achelia would turn out if they didn't rise up a bit more promptly.",
        img:"Achelia3.png"
    },
    {
        title:"KENDALL X KENDALL INTERVIEW",
        alt:"Kendall.1 and Kendall.3 standing side-by-side with their heads touching, grinning at each-other.",
        desc:"Having used time-travel to arrange for multiple Kendalls to meet, we discuss our lives and the differences in our work. More planned soon.",
        img:"KendallKendall.png"
    },
    {
        title:"EXRA-SPECIAL GUEST TEASER",
        alt:"Kendall facing a blank figure with a question-mark",
        img:"guestTeaser.png",
        desc:"I hear you all like time-travel, so I've planned an interview with a guest-star not available in the present."
    },
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
