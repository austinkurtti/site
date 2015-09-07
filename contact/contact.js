function submit() {
    $(document)[0].getElementById("submit").className = "clicked";
    setTimeout(function() {
        $(document)[0].getElementById("submit").className="";
    }, (0.5 * 1000));
}
