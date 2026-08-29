const musica = document.getElementById("please-work");
const commentsvis = document.getElementById("comments-screen");
const supabaseKey = "sb_publishable_5l2itKf_AQb8ZRAt7mwJdQ_iiRhYyS_";
const supabaseUrl = "https://knscogotkmdypzlhehov.supabase.co";
const yipee = supabase.createClient(supabaseUrl, supabaseKey);
const commentsNameInput = document.getElementById("comments-name");
const commentsMessageInput = document.getElementById("comments-message");
const commentsSubmitButton = document.getElementById("comments-submit");
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
commentsbtn.addEventListener('click', function () {
    homevis.style.display = "none"
    aboutvis.style.display = "none"
    projectsvis.style.display = "none"
    aspvis.style.display = "none"
    commentsvis.style.display = "block"
    vibin("4s0VBDxeEXY")
    //musica.src = "https://www.youtube.com/embed/4s0VBDxeEXY?enablejsapi=1&autoplay=1&loop=1&playlist=4s0VBDxeEXY";
})
async function fetchComments() {
    const { data, error } = await yipee
        .from('comments')
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
commentsSubmitButton.addEventListener('click', async function () {
    const name = commentsNameInput.value.trim();
    const message = commentsMessageInput.value.trim();
    if (name === "" || message === "") {
        alert("Please enter both your name and a message.");
        return;
    }
    const { error } = await yipee
        .from('comments')
        .insert([{ name: name, message: message }]);
    if (error) {
        alert("The cloud doesn't want to work right now, try again later :P");
        console.error("Error submitting comment:", error);
    } else {
        commentsNameInput.value = "";
        commentsMessageInput.value = "";
    }
});
yipee
    .channel('schema-db-changes')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'comments' }, (payload) => {
        fetchComments();
    })
    .subscribe();
fetchComments();
