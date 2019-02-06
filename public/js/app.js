$(document).ready(function() {

    $("#product1").on("click", () => {
        let url = "https://www.coachingwithsadik.com/products/4-week-diet-training"
        window.open(url);
    });

    $("#product2").on("click", () => {
        let url = "https://www.coachingwithsadik.com/products/8-week-diet-training"
        window.open(url);
    });

    $("#product3").on("click", () => {
        let url = "https://www.coachingwithsadik.com/products/12-week-diet-training"
        window.open(url);
    });


    // Real-time Validation

        // First Name Validation
        $("#form-first-name").on("input", () => {
            let input = $("#form-first-name");
            let firstName = input.val();
            if (firstName) {input.removeClass("invalid").addClass("valid");} 
            else {input.removeClass("valid").addClass("invalid");}
        });

        // Last Name Validation
        $("#form-last-name").on("input", () => {
            let input = $("#form-last-name");
            let lastName = input.val();
            if (lastName) {input.removeClass("invalid").addClass("valid");} 
            else {input.removeClass("valid").addClass("invalid");}
        });
        
        // Email Validation
        $("#form-email").on("input", () => {
            let input = $("#form-email");
            let re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            let formEmail = re.test(input.val());
            if (formEmail) {input.removeClass("invalid").addClass("valid");} 
            else {input.removeClass("valid").addClass("invalid");}
        });        
        
        // Goals Validation
        $("#form-goals").keyup((event) => {
            let input = $("#form-goals");
            let goals = input.val();
            if (goals) {
                input.removeClass("invalid").addClass("valid");} 
            else {input.removeClass("valid").addClass("invalid");}
        });

    // On-Submit Validation
    $("#submit-form").on("click", (event) => {        
        let formData = $("#form").serializeArray();
        let errorFree = true;

        for (let input in formData) {
            let element = $("#form-" + formData[input]['name']);
            let valid = element.hasClass("valid");
            let errorElement = $("span", element.parent());
            if (!valid) {
                errorElement.removeClass("error").addClass("error-show"); 
                errorFree = false;
            } else { 
                errorElement.removeClass("error-show").addClass("error");
            }
        }

        // Collect form values
        let firstName = $("#form-first-name").val().trim();
        let lastName = $("#form-last-name").val().trim();
        let email = $("#form-email").val().trim();
        let experience = $("#form input[type='radio']:checked").val();        
        let lifestyle = $("#form input[type='range']").val();
        let goals = $("#form-goals").val();
        
        // NOPE
        if (!errorFree) {
            event.preventDefault(); 

            $("#error-warning").removeClass("hide-warning").addClass("show-warning");
        }

        // OKAY 
        else {
            event.preventDefault();

            // Data to send via email
            let newApplication = {
                firstname: firstName,
                lastname: lastName,
                email: email,
                experience: experience,
                lifestyle: lifestyle,
                goals: goals
            }

            console.log(newApplication);
          
            // Send email
            $.post("/send", newApplication, data => {
              console.log(newApplication);
            });

            // Clear form
            firstName = $("#form-first-name").val("");
            lastName = $("#form-last-name").val("");
            email = $("#form-email").val("");
            goals = $("#form-goals").val("");          

            //Remove validation classes
            $("#form-first-name").removeClass("valid");
            $("#form-last-name").removeClass("valid");
            $("#form-email").removeClass("valid");
            $("#form-goals").removeClass("valid");

            // Change & disable send button
            $("#submit-form").text("BOOM!").addClass("sent").attr("disabled", "disabled");

            // Display sent message
            $(".sent-message").addClass("show-sent-message").removeClass("sent-message");

        }
    });

});