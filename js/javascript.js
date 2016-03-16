var charmander = {
    name: "Charmander",
    health: 100,
    lvl: 12,
    effect: null,
    moves: [
        {
            name: "Ember",
            type: "Attack",
            power: 20,
            accuracy: .80
        },
        {
            name: "Scratch",
            type: "Attack",
            power: 10,
            accuracy: .90
        },
        {
            name: "Leer",
            type: "Defense",
            power: .20,
            accuracy: 1.0
        },
        {
            name: "Growl",
            type: "Defense",
            power: .65,
            accuracy: .65
        }
    ]
};

var pikachu = {
    name: "Pikachu",
    health: 100,
    lvl: 9,
    effect: null,
    moves: [
        {
            name: "Thundershock",
            type: "Attack",
            power: 10,
            accuracy: .95
        },
        {
            name: "Thunder Wave",
            type: "Attack",
            power: 25,
            accuracy: .60
        },
        {
            name: "Tail Whip",
            type: "Defense",
            power: .15,
            accuracy: 1.0
        },
        {
            name: "Growl",
            type: "Defense",
            power: .65,
            accuracy: .65
        }
    ]
};

var currentState;
var cpuPokemon;
var userPokemon;


var cpuTurn = {
    play: function () {
        /*Floor sets number as integer, Random gives random # between 0-1*/
        var randomMove = Math.floor(Math.random() * 4);
        var currentCpuMove = cpuPokemon.moves[randomMove];

        var setUpCpuField = function () {
            $("#chat-text").text("What will " + userPokemon.name + " do?");
            prepareToAttack();
        };

        /* Animation: Moves image down 25 then up 25*/
        var prepareToAttack = function () {
            $("#pikachu-img").animate({
                top: "-=25"
            }, 200, function () {
                $("#pikachu-img").animate({
                    top: "+=25"
                }, 200)
            });
            getAccuracy();
        };

        var getAccuracy = function () {
            var setAccuracy = Math.random();
            if (setAccuracy <= currentCpuMove.accuracy) {
                $("#chat-text").text(cpuPokemon.name + " used " + currentCpuMove.name + "!");
                /* only needed if move hits */
                getMoveType();
            } else {
                $("#chat-text").text(cpuPokemon.name + " missed " + currentCpuMove.name + "!");
                currentState = playerTurn;
                /*Waits a second and a half and calls loop() again*/
                setTimeout(loop, 1500)
            }
        };

        var getMoveType = function () {
            showMoveAnimation();

            if (currentCpuMove.type == "Attack") {
                /* Slows down program for game flow */
                setTimeout(attackingMove, 1500);
            } else {
                setTimeout(defensiveMove, 1500);
            }
        };

        var showMoveAnimation = function () {
            $("#attack-img").addClass("cpu-attack-img")
                .removeClass("hide")
                .fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100);
        };

        var attackingMove = function () {
            $("#attack-img").addClass("hide")
                .addClass("cpu-attack-img");
            if (!cpuPokemon.effect) {
                userPokemon.health -= currentCpuMove.power;
            } else {
                userPokemon.health -= (currentCpuMove.power) - (currentCpuMove.power * cpuPokemon.effect);
                cpuPokemon.effect = null;
            }
            /* Animates HP Bar */
            $("#user-health-bar").css("width", userPokemon.health + "%");
            currentState = playerTurn;
            loop();
        };

        var defensiveMove = function () {
            $("#attack-img").addClass("hide")
                .removeClass("cpu-attack-img");
            userPokemon.effect = currentCpuMove.power;
            currentState = playerTurn;
            loop();
        };

        setUpCpuField();
    }
};

var playerTurn = {
    play: function () {
        var currentUserMove;

        var setUpUserField = function () {
            var moveButtons = ["#move1-text", "#move2-text", "#move3-text", "#move4-text"];

            $("#user-buttons").removeClass("hide");
            $("#chat-text").text("What will " + userPokemon.name + " do?");

            /* Setting each button */
            for (var i = moveButtons.length - 1; i >= 0; i--) {
                $(moveButtons[i]).text(userPokemon.moves[i].name);
            }
        };

        /* Animation: Moves image down 25 then up 25*/
        var prepareToAttack = function () {
            $("#user-buttons").addClass("hide");

            $("#charmander-img").animate({
                top: "-=25"
            }, 200, function () {
                $("#charmander-img").animate({
                    top: "+=25"
                }, 200)
            });
            getAccuracy();
        };

        var getAccuracy = function () {
            var setAccuracy = Math.random();
            if (setAccuracy <= currentUserMove.accuracy) {
                $("#chat-text").text(userPokemon.name + " used " + currentUserMove.name + "!");
                /* only needed if move hits */
                getMoveType();
            } else {
                $("#chat-text").text(userPokemon.name + " missed " + currentUserMove.name + "!");
                currentState = cpuTurn;
                /*Waits a second and a half and calls loop() again*/
                setTimeout(loop, 1500)
            }
        };

        var getMoveType = function () {
            showMoveAnimation();

            if (currentUserMove.type == "Attack") {
                /* Slows down program for game flow */
                setTimeout(attackingMove, 1500);
            } else {
                setTimeout(defensiveMove, 1500);
            }
        };

        var showMoveAnimation = function () {
            $("#attack-img").addClass("user-attack-img")
                .removeClass("hide")
                .fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100);
        };

        var attackingMove = function () {
            $("#attack-img").addClass("hide")
                .addClass("user-attack-img");
            if (!userPokemon.effect) {
                cpuPokemon.health -= currentUserMove.power;
            } else {
                cpuPokemon.health -= (currentUserMove.power) - (currentUserMove.power * userPokemon.effect);
                userPokemon.effect = null;
            }
            /* Animates HP Bar */
            $("#cpu-health-bar").css("width", cpuPokemon.health + "%");
            currentState = cpuTurn;
            loop();
        };

        var defensiveMove = function () {
            $("#attack-img").addClass("hide")
                .removeClass("user-attack-img");
            cpuPokemon.effect = currentUserMove.power;
            currentState = cpuTurn;
            loop();
        };

        /* Unbind used to prevent attacking bug */
        //Run once
        $("#move1-button, #move2-button, #move3-button, #move4-button").unbind().click(function () {
            var move = $(this).attr("value");
            console.log("Click");
            currentUserMove = userPokemon.moves[move];
            prepareToAttack();
        });

        setUpUserField();
    }
};

var loop = function () {
    if (cpuPokemon.health <= 0 || userPokemon.health <= 0) {
        $("#game-over").removeClass("hide");
        console.log("Game Over: Pokemon Fainted");
    } else {
        currentState.play();
    }
};


var init = function () {
    cpuPokemon = pikachu;
    userPokemon = charmander;
    $("#cpu-name").text(cpuPokemon.name);
    $("#cpu-lvl").text("lvl " + cpuPokemon.lvl);
    $("#user-name").text(userPokemon.name);
    $("#user-lvl").text("lvl " + userPokemon.lvl);
    currentState = playerTurn;
    /*add speed attrib to Pokemon todo*/
    loop();
};

init();