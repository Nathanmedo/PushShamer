const repoUrl = new URL("https://api.github.com/repos/Nathanmedo/PushShamer")

const [owner, repo] = repoUrl.pathname.split('/').filter(Boolean).slice(-2);
    
    console.log(owner, repo)