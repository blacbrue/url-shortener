$("#su-form").submit((e) => {
    e.preventDefault();

    if ($("#url").val() === "") {
        alert("The text field is empty.");
        return false;
    } else {
        const input = $("#url").val();
        let url;

        try {
            url = new URL(input)
        } catch {
            alert("You have entered an invalid URL.");
            return false;
        }

        if ($("#shorten-url-btn").css("display") === "block" && $("#shortening-spinner").css("display") === "none" && $("#copy-link").css("display") === "none") {
            $("#shorten-url-btn").css("display", "none")
            $("#shortening-spinner").css("display", "block")
            $("#url").prop("disabled", true)
        }

        fetch(`/api/getCode?url=${url.href}`, {
            method: "GET"
        }).then(res => { 
            return res.json() 
        }).then(async data =>{
            if (data) {
                $("#label-url").text("Shortened URL:")
                $("#shortened-url").css("display", "block")
                $("#url").css("display", "none")
                $("#shortened-url").val(`${window.location.origin}/${data.code}`)
                $("#shortening-spinner").css("display", "none")
                $("#copy-link").css("display", "block")
                $("#reload").css("display", "block")
            }
        }).catch(err => {
            $("#label-url").text("Shortened URL:")
            $("#shortened-url").css("display", "block")
            $("#url").css("display", "none")
            $("#shortened-url").val(`${window.location.origin}/${err.code}`)
            $("#shortening-spinner").css("display", "none")
            $("#copy-link").css("display", "block")
            $("#reload").css("display", "block")
        })
    }
})

$("#copy-link").click(() => {
    const inputVal = document.getElementById("shortened-url");

    inputVal.select()
    inputVal.setSelectionRange(0, 99999)

    navigator.clipboard.writeText(inputVal.value);

    alert("Copied to clipboard!");
})

$("#reload").click(() => {
    $("#shortened-url").val() === ""
    $("#url").val() === ""
    window.location.reload(true)
    return false
})