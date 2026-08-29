const musica = document.getElementById("please-work");
const guestbookvis = document.getElementById("guestbook-screen");
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50amVremRvamR6cndqbWx5aGNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4NTY2NTUsImV4cCI6MjA5NjQzMjY1NX0.jSOz_CQ_F2S0SUSpyCdOEZqXg8hB0IF5RQs0mV-xkZg";
const supabaseUrl = "https://ntjekzdojdzrwjmlyhcd.supabase.co";
const yipee = supabase.createClient(supabaseUrl, supabaseKey);
const guestbookNameInput = document.getElementById("guestbook-name");
const guestbookMessageInput = document.getElementById("guestbook-message");
const guestbookSubmitButton = document.getElementById("guestbook-submit");
const commentsStream = document.getElementById("comments-stream");
// window.addEventListener('click' function() {
//     if(sanctuary===false){
//         document.getElementById("please-work").src = "https://www.youtube.com/embed/QQQq1T06lYg?autoplay=1&loop=1&playlist=QQQq1T06lYg";
//         sanctuary = true;
//     }

// });
function vibin(videoId){
    musica.contentWindow.postMessage(JSON.stringify({
        event:'command',
        func: 'loadVideoById',
        args:[videoId]
    }), '*');
}
guestbookbtn.addEventListener('click', function () {
    homevis.style.display = "none"
    aboutvis.style.display = "none"
    projectsvis.style.display = "none"
    aspvis.style.display = "none"
    guestbookvis.style.display = "block"
    vibin("4s0VBDxeEXY")
    //musica.src = "https://www.youtube.com/embed/4s0VBDxeEXY?enablejsapi=1&autoplay=1&loop=1&playlist=4s0VBDxeEXY";
})
async function fetchComments() {
    const { data, error } = await yipee
        .from('guestbook')
        .select('*')
        .order('created_at', { ascending: false });
    if (error) {
        console.error("Error fetching comments:", error);
        return;
    }
    commentsStream.innerHTML = "";
    data.forEach(entry => {
        const commentDiv = document.createElement("div");
        commentDiv.style.background = "rgba(0,200,255,0.1)";
        commentDiv.style.padding = "10px";
        commentDiv.style.margin = "10px 0";
        commentDiv.style.borderRadius = "5px";
        commentDiv.innerHTML = `<strong>${entry.name}</strong><p>${entry.message}</p><small>${new Date(entry.created_at).toLocaleString()}</small>`;
        commentsStream.appendChild(commentDiv);
    });
}
guestbookSubmitButton.addEventListener('click', async function () {
    const name = guestbookNameInput.value.trim();
    const message = guestbookMessageInput.value.trim();
    if (name === "" || message === "") {
        alert("Please enter both your name and a message.");
        return;
    }
    const { error } = await yipee
        .from('guestbook')
        .insert([{ name: name, message: message }]);
    if (error) {
        alert("The cloud doesn't want to work right now, try again later :P");
        console.error("Error submitting comment:", error);
    } else {
        guestbookNameInput.value = "";
        guestbookMessageInput.value = "";
    }
});
yipee
    .channel('schema-db-changes')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'guestbook' }, (payload) => {
        fetchComments();
    })
    .subscribe();
fetchComments();
