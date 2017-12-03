"use strict";

$('textarea').click(() => { $('textarea').removeAttr("style").css('backgroundColor', '#fff') });

const app = angular.module('app', []);

app.controller('ctr1', ['$scope', '$rootScope', '$interval', '$timeout', 'navigate', 'animate', 'taskRunner', function($scope, $rootScope, $interval, $timeout, navigate, animate, taskRunner){
  $rootScope.sliding = false;
  $rootScope.slideText = 'You\'ve Thought It Up'
  $rootScope.page3navigationTime = 700;
  $rootScope.page4navigationTime = 900;
  $rootScope.signUpPageMessage = '';
  $rootScope.onSignInPage = true;
  $rootScope.onAuthPage = false;
  $rootScope.loggedIn = false;
  $rootScope.slideNotStarted = true;
  $rootScope.profileOpen = false;
  $scope.homeText = "you've thought up a website to serve business needs... you've writen details outlining its content, purpose, and audience... you've done enough... let me build it"
  $scope.navigate = (e) => { navigate.page(e) }
  $scope.slideshow = (e) => {
    if(!$rootScope.sliding){
      navigate.slideshow(e);
      //$interval.cancel(playSlide);
    }
  }
  $scope.signUp = () => { animate.signUp() }
  $scope.signIn = () => { animate.signIn() }
  $scope.signUpBackBtn = () => { animate.signUpBackBtn() }
  $scope.signUpEnterBtn = () => { animate.signUpEnterBtn() }
  $scope.sendEmail = () => { taskRunner.checkEmailFields() }
  $scope.sendText = () => { taskRunner.checkTextFields() }
  $scope.enter = (e) => { taskRunner.enter(e) }

  navigate.watchForAnimation();
  taskRunner.functionality();
  taskRunner.trackTopButton();

  const slideshowPlayObject = { target: { className: 'slide-right' }};

  const startSlider = () => {
    if(slideNumber === 3){
      return null
    } else {
      slideNumber++
      $timeout(() => {
        navigate.slideshow(slideshowPlayObject);
        startSlider();
      }, 6000);
    }
  }

  let slideNumber = 0;
  const startSlideFn = $interval(() => {
    if($rootScope.loggedIn){
      startSlider();
      $interval.cancel(startSlideFn);
    }
  }, 250);

}]);

app.service('navigate', function($rootScope, $interval, $timeout, taskRunner, animate, server){
  this.page = (e) => {
    const className = e.currentTarget.className;
    const toSecondPage = className.includes('one');
    const toThirdPage = className.includes('two');
    const toFourthPage = className.includes('three');
    const toFirstPage = className.includes('four');
    const toProfile = className.includes('five');
    const toLogout = className.includes("logout");
    const toDelete = className.includes("delete");
    if(toSecondPage){ $("html, body").animate({ scrollTop: "680px" }) }
    else if(toThirdPage){ $("html, body").animate({ scrollTop: "1480px" }, $rootScope.page3navigationTime) }
    else if(toFourthPage){ $("html, body").animate({ scrollTop: "2146px" }, $rootScope.page4navigationTime) }
    else if (toProfile) {
      if(!$rootScope.profileOpen){ animate.fadeInFromLeftWithPosition('nav-circle.six', 250, '90vw') }
      else { animate.fadeOutToLeftWithPosition('nav-circle.six', 250, '88vw') }
    }
    else if(toFirstPage){ $("html, body").animate({ scrollTop: "0px" }) }
    else if(toLogout){
      if($rootScope.profileOpen){
        $(".container").fadeOut();
        $('.deleteScreen').fadeOut();
        $timeout(() => { $('.logoutScreen').fadeIn() }, 1000);
      }
    }
    else if(toDelete){
      if($rootScope.profileOpen){
        const url = "http://localhost:3000/deleteaccount";
        server.delete($rootScope._id, url);
        $(".container").fadeOut();
        $('.logoutScreen').fadeOut();
        $timeout(() => { $('.deleteScreen').fadeIn() }, 1000);
      }
    }
  }
  this.slideshow = (e) => {
    const isRightSlideButton = e.target.className.includes('slide-right');
    const isLeftSlideButton = e.target.className.includes('slide-left');
    const fadeDistance = '2em';
    $rootScope.sliding = true;

    if(isRightSlideButton){
      animate.fadeOutToRight('slide-show-img img', fadeDistance, 500);
      $timeout(() => {
        taskRunner.nextSlide('right');
        $('.slide-show-img img').css('left', '-' + fadeDistance);
        animate.fadeInFromLeft('slide-show-img img', 500);
      }, 600);
      $timeout(() => { $rootScope.sliding = false }, 1200);
    } else if (isLeftSlideButton) {
      animate.fadeOutToLeft('slide-show-img img', fadeDistance, 500);
      $timeout(() => {
        taskRunner.nextSlide('left');
        $('.slide-show-img img').css('left', fadeDistance);
        animate.fadeInFromRight('slide-show-img img', 500);
      }, 600);
      $timeout(() => { $rootScope.sliding = false }, 1110);
    }

  }
  this.watchForAnimation = () => {
    const startP2Animation = $interval(() => {
      const windowPosition = $(window).scrollTop();
      if(windowPosition > 100){
        animate.page(2);
        $interval.cancel(startP2Animation);
      }
    }, 10);
    const startP3Animation = $interval(() => {
      const windowPosition = $(window).scrollTop();
      if(windowPosition > 950){
        animate.page(3);
        $interval.cancel(startP3Animation);
      }
    }, 10);
    const startP4Animation = $interval(() => {
      const windowPosition = $(window).scrollTop();
      if(windowPosition > 1880){
        animate.page(4);
        $interval.cancel(startP4Animation);
      }
    }, 1000);
  }
});

app.service('taskRunner', function($rootScope, $interval, $timeout, server){
  this.nextSlide = (direction) => {
    const $currentHighlightedLine = $('.active.slider');
    const $className = $currentHighlightedLine.attr('class');
    const isSlideOne = $className.includes('slide-one');
    const isSlideTwo = $className.includes('slide-two');
    const isSlideThree = $className.includes('slide-three');
    const tree = {
      slideOne: {
        right: {
          line: 'slide-two',
          img: 'pen.png',
          text: 'You\'ve Planned It'
        },
        left: {
          line: 'slide-three',
          img: 'hammer.png',
          text: 'Now Let Me Build It'
        }
      },
      slideTwo: {
        right: {
          line: 'slide-three',
          img: 'hammer.png',
          text: 'Now Let Me Build It'
        },
        left: {
          line: 'slide-one',
          img: 'bulbbrain.png',
          text: 'You\'ve Thought It Up'
        }
      },
      slideThree: {
        right: {
          line: 'slide-one',
          img: 'bulbbrain.png',
          text: 'You\'ve Thought It Up'
        },
        left: {
          line: 'slide-two',
          img: 'pen.png',
          text: 'You\'ve Planned It'
        }
      }
    }
    const highlightNextLine = (current) => {
      if(direction === 'right'){
        $('.' + tree[current].right.line).addClass('active');
        $('.slide-show-img img').attr('src', './images/' + tree[current].right.img);
        $rootScope.slideText = tree[current].right.text;
      } else if (direction === 'left') {
        $('.' + tree[current].left.line).addClass('active');
        $('.slide-show-img img').attr('src', './images/' + tree[current].left.img);
        $rootScope.slideText = tree[current].left.text;
      }
    };

    $('.slider').removeClass('active');

    if(isSlideOne){
      highlightNextLine('slideOne');
    } else if (isSlideTwo) {
      highlightNextLine('slideTwo');
    } else if (isSlideThree) {
      highlightNextLine('slideThree');
    }
  }
  this.checkEmailFields = () => {
    const url = "http://localhost:3000/email";
    const userName = $('#userName').val();
    const userEmail = $('#userEmail').val();
    const userSubject = $('#userSubject').val();
    const userMessage = $('#userMessage').val();
    const nameNotEmpty = userName != '';
    const emailNotEmpty = userEmail != '';
    const subjectNotEmpty = userSubject != '';
    const messageNotEmpty = userMessage != '';

    if(nameNotEmpty && emailNotEmpty && subjectNotEmpty && messageNotEmpty){
      console.log('sending email...');
      //display the loader
      $('.send-btn p').text('');
      $('.send-btn').addClass('loader');

      server.email(userName, userEmail, userSubject, userMessage, url);
    } else {
      $('.send-btn p').text('please fill in all fields');
      $('.send-btn').addClass('emailAllField');
      $timeout(() => {
        $('.send-btn p').text('send');
        $('.send-btn').removeClass('emailAllField');
      }, 3000 );
    }
  }
  this.checkTextFields = () => {
    const url = "http://localhost:3000/text";
    const userName = $('#userNameText').val();
    const userNumber = $('#userNumberText').val();
    const userMessage = $('#userMessageText').val();
    const nameNotEmpty = userName != '';
    const numberNotEmpty = userNumber != '';
    const messageNotEmpty = userMessage != '';

    if(nameNotEmpty && numberNotEmpty && messageNotEmpty){
      console.log('sending text...');
      //display the loader
      $('.send-text-btn p').text('');
      $('.send-text-btn').addClass('loader');

      server.text(userName, userNumber, userMessage, url);
    } else {
      $('.send-text-btn p').text('please fill in all fields');
      $('.send-text-btn').addClass('emailAllField');
      $timeout(() => {
        $('.send-text-btn p').text('send');
        $('.send-text-btn').removeClass('emailAllField');
      }, 3000 );
    }
  }
  this.enter = (e) => {
    const firstname = $('#firstname').val();
    const lastname = $('#lastname').val();
    const username = $('#username').val();
    const password = $('#password').val();
    const firstnameNotEmpty = firstname != '';
    const lastnameNotEmpty = lastname != '';
    const usernameNotEmpty = username != '';
    const passwordNotEmpty = password != '';
    const enterPressed = e.key === 'Enter';
    if($rootScope.onAuthPage && enterPressed){
      if($rootScope.onSignInPage){
        if(usernameNotEmpty && passwordNotEmpty){
          const url = "http://localhost:3000/login";
          server.loginRequest(username, password, url);
        }
      } else {
        if(firstnameNotEmpty && lastnameNotEmpty && usernameNotEmpty && passwordNotEmpty){
          const url = "http://localhost:3000/register";
          server.register(username, password, firstname, lastname, url);
        }
      }
    }
  }
  this.functionality = () => {
    //const changeImage = (img) => { $('.sendingMethod').css('backgroundImage', 'url(' + img + ')') }
    // $('.emailSender').mouseover(() => { changeImage('../images/email.png') });
    // $('.textSender').mouseover(() => { changeImage('../images/text.png') });
    $("html, body").animate({ scrollTop: "0px" });
    $('.emailbtn p').fadeOut();
    $('.textbtn p').fadeOut();
    const highlight = (selector) => { $(selector).removeClass('opacityZero'); }
    $('.emailSender').mouseover(() => { highlight('.emailbtn h1') });
    $('.textSender').mouseover(() => { highlight('.textbtn h1') });
    const undohighlight = (selector) => { $(selector).addClass('opacityZero'); }
    $('.emailSender').mouseleave(() => { undohighlight('.emailbtn h1') });
    $('.textSender').mouseleave(() => { undohighlight('.textbtn h1') });

    $(window).scrollTop(0);
    $('.signUpPageMessage').fadeOut(10).removeClass('opacityZero');
    $('.form-view').fadeOut(10).removeClass('opacityZero');

    $('.page2img').fadeOut();

    $(".logoutScreen").fadeOut();
    $(".deleteScreen").fadeOut();

    $('.delete').mouseover(() => {
      if($rootScope.profileOpen){
        $('.five p').html('&#x2639;');
      }
    });

    $('.delete').mouseout(() => {
      $('.five p').html('&#x263B;');
    });

  }
  this.trackTopButton = () => {
    $interval(() => {
      let pagePosition = $(window).scrollTop();
      if (pagePosition > 640) { $('.nav-circle.four').css('opacity', 1) }
      else { $('.nav-circle.four').css('opacity', 0) }
    }, 500);
  }
});

app.service('animate', function($rootScope, $interval, $timeout, server){
  this.fadeInFromLeft = (selector, time) => {
    $('.' + selector).animate({ left: 0, opacity: 1 }, time);
  }
  this.fadeInFromLeftWithPosition = (selector, time, position) => {
    $('.' + selector).animate({ left: position, opacity: 1 }, time);
    $rootScope.profileOpen = true;
  }
  this.fadeOutToLeftWithPosition = (selector, time, position) => {
    $('.' + selector).animate({ left: position, opacity: 0 }, time);
    $rootScope.profileOpen = false;
  }
  this.fadeInFromRight = (selector, time) => {
    $('.' + selector).animate({ left: 0, opacity: 1 }, time);
  }
  this.fadeOutToLeft = (selector, fadeDistance, time) => {
    $('.' + selector).animate({ left: '-' + fadeDistance, opacity: 0 }, time);
  }
  this.fadeOutToRight = (selector, fadeDistance, time) => {
    $('.' + selector).animate({ left: fadeDistance, opacity: 0 }, time);
  }
  this.page = (page) => {
    if(page === 2){
      $('.page2top2').animate({ left: 0, opacity: 1 }, 500);
      $timeout(() => { $('.page2top3').animate({ left: 0, opacity: 1 }, 500) }, 350);
      //bottom page first animation
      $timeout(() => { $('.centerDevice').animate({opacity: 1}) }, 600);
      const deviceImages = ['url(../images/cellphone.png)', 'url(../images/tablet.png)', 'url(../images/laptop.png)', 'url(../images/desktop.png)'];
      const surroudingDeviceClasses = ['.deviceOne', '.deviceTwo', '.deviceThree', '.deviceFour']
      let indexTracker = 0;
      let indexTracker2 = 0;
      let centerDeviceChanger;
      let sideDeviceChanger;

      //first first animation
      $timeout(() => {
        centerDeviceChanger = $interval(function () {
                                $('.centerDevice').css('backgroundImage', deviceImages[indexTracker]);
                                indexTracker++;
                                if(indexTracker === 4){
                                  indexTracker = 0;
                                  $interval.cancel(centerDeviceChanger);
                                  centerDeviceChanger = $interval(function () {
                                                          $('.centerDevice').css('backgroundImage', deviceImages[indexTracker]);
                                                          indexTracker++;
                                                          if(indexTracker === 4){ indexTracker = 0 }
                                                        }, 2000);
                                }
                              }, 750);
        $timeout(() => {
          sideDeviceChanger = $interval(function () {
                                  $(surroudingDeviceClasses[indexTracker2]).css('backgroundImage', deviceImages[indexTracker2]).animate({opacity: 1});
                                  indexTracker2++;
                                  if(indexTracker2 === 4){
                                    $interval.cancel(sideDeviceChanger);
                                  }
                                }, 750);
          $timeout(() => {
            $('.deviceHolder').addClass('spinner');
            $('.deviceSpin').addClass('spinnerReverse');
          }, 3250);
        }, 750);
      }, 800);

      //second animation

      const feed = (target) => {
        $('.ballStream').prepend('<div class="' + target + '"></div>');
        $('.' + target).animate({
          left: '100%'
        }, {
          duration: 700,
          complete: () => {
            $('.' + target).remove();
            $timeout(() => {
              feed(target);
            }, 200);
          }
        });
      }

      $timeout(() => {
        $('.pacman').animate({ opacity: 1 }, 600);
        feed('ball');
      }, 5000);

      //third animation

      $rootScope.money = '$100';

      let dropPrice = () => {
        $('.money p').addClass('tooMuch');
        $('.dropZero').addClass('tooMuch');
        $timeout(() => {
          $('.dropZero').animate({ top: '2em' }, {
            duration: 500,
            complete: () => {
              $('.dropZero').removeClass('tooMuch');
              $('.money p').removeClass('tooMuch');
              $timeout(() => {
                $('.dropZero').animate({ top: 0 }, {
                  duration: 500,
                  complete: () => {
                    dropPrice();
                  }
                })
              }, 800);
            }
          });
        }, 1000);
      }

      const moneyDrop = $timeout(() => {
        $('.money p').addClass('tooMuch');
        $('.dropZero').addClass('tooMuch');
        $('.money').animate({ opacity: 1 }, {
          duration: 500,
          complete: () => {
            dropPrice();
          }
        });
      }, 7500);

      //stop animations

      $timeout(() => {
        $('.deviceParent').fadeOut();
      }, 7400);

      $timeout(() => {
        $interval.cancel(centerDeviceChanger);
        $('.deviceHolder').removeClass('spinner');
        $('.deviceSpin').removeClass('spinnerReverse');
      }, 7800);

      $timeout(function () {
        $('.money').fadeOut();
        dropPrice = () => { return null }
      }, 13000);

      $timeout(function () {
        $('.ballStream').fadeOut();
        $('.pacman').fadeOut();
      }, 15000);

      $timeout(() => {
        $('.page2bottomChild').hide();
        $('.page2img').fadeIn();
      }, 16000);

    } else if (page === 3) {
      $('.basic').animate({ left: 0, opacity: 1 }, 500);
      $('.custom').animate({ left: 0, opacity: 1 }, 500);
    } else if (page === 4) {
      $('.page4leftside').animate({ left: '0%' }, {
        duration: 400,
        start: () => {
          $('.page4rightside').animate({ left: '0%' });
        }
      });
      $timeout(() => {
        $('.page4middle').animate({ opacity: 1 }, 400);
      }, 800),
      $timeout(() => {
        $('.contactHeading').animate({ opacity: 1 });
        $('.send-btn').css('transform', 'rotateY(0deg)');
        $('.send-text-btn').css('transform', 'rotateY(0deg)');
        $('.emailbtn p').fadeIn();
        $('.textbtn p').fadeIn();
      }, 400);
    }
  }
  this.signUp = () => {
    $rootScope.onSignInPage = false;
    $rootScope.onAuthPage = true;
    $('input').val('');
    $('.signup-view').fadeOut();
    $('#firstname').removeClass('none');
    $('#lastname').removeClass('none');
    $('.page1 form').removeClass('signInForm');
    $('.page1 form').addClass('signUpForm');
    $timeout(() => { $('.form-view').fadeIn() }, 1100);
    $timeout(() => { $('#firstname').focus() }, 1200);
  }
  this.signIn = () => {
    $rootScope.onSignInPage = true;
    $rootScope.onAuthPage = true;
    $('input').val('');
    $('.signup-view').fadeOut();
    $('#firstname').addClass('none');
    $('#lastname').addClass('none');
    $('.page1 form').removeClass('signUpForm');
    $('.page1 form').addClass('signInForm');
    $timeout(() => { $('.form-view').fadeIn() }, 1100);
    $timeout(() => { $('#username').focus() }, 1200);
  }
  this.signUpBackBtn = () => {
    $rootScope.onAuthPage = false;
    $('.signUpPageMessage').fadeOut();
    $('.form-view').fadeOut();
    $timeout(() => { $('.signup-view').fadeIn() }, 1100);
  }
  this.signUpEnterBtn = () => {
    const isSignUp  = $('.page1 form').hasClass('signUpForm');
    if(isSignUp){
      const url = "http://localhost:3000/register";
      const firstname = $('#firstname').val();
      const lastname = $('#lastname').val();
      const username = $('#username').val();
      const password = $('#password').val();
      server.register(username, password, firstname, lastname, url);
    } else {
      const url = "http://localhost:3000/login";
      const username = $('#username').val();
      const password = $('#password').val();
      server.loginRequest(username, password, url);
    }
  }
});

app.service("server", function($http, $rootScope, $interval, $timeout, auth){
  this.loginRequest = (username, password, url) => {
    const data = {
      username: username,
      password: password
    }

    $http({
      method: 'POST',
      url: url,
      data: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    }).then(
        (success) => { successCallback(success) },
        (error) => { errorCallback(error.data) }
      );

    const successCallback = (success) => {
      console.log(success);
      console.log("successfully logged in");
      $('.signUpPageMessage').hide();
      auth.logIn();
      $('input').val('');
      this.setUserInfo(success);
    }

    const errorCallback = () => {
      $('.signUpPageMessage').css('color', '#e75454');
      $('.signUpPageMessage').fadeIn();
      $rootScope.signUpPageMessage = 'incorrect username and/or password';
    }
  };
  this.register = (username, password, firstname, lastname, url) => {
    const data = {
      username: username,
      password: password,
      firstname: firstname,
      lastname: lastname
    }

    $http({
      method: 'POST',
      url: url,
      data: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    }).then(
        (success) => { successCallback(success) },
        (error) => { errorCallback(error.data) }
      );

    const successCallback = (success) => {
      $rootScope.onAuthPage = true;
      $rootScope.onSignInPage = true;
      $('.signUpPageMessage').css('color', '#fbfbfb');
      $('.signUpPageMessage').fadeIn();
      $('input').val('');
      $rootScope.signUpPageMessage = "Thank you for registering! Try logging in.";
      $('.form-view').fadeOut(500);
      $timeout(() => {
        auth.signIn();
        $timeout(() => { $('.signUpPageMessage').fadeOut() }, 3000);
      }, 500);
      $timeout(() => { $('#username').focus() }, 1700);
    }

    const errorCallback = () => {
      $('.signUpPageMessage').css('color', '#e75454');
      $('.signUpPageMessage').fadeIn();
      $rootScope.signUpPageMessage = "User name taken. Sorry...";
    }
  }
  this.delete = (id, url) => {

    const data = {
      id: id
    }

    $http({
      method: 'DELETE',
      url: url,
      data: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    }).then(
        (success) => { successCallback(success) },
        (error) => { errorCallback(error.data) }
      );

    const successCallback = (success) => {
      console.log('account deleted');
    }

    const errorCallback = () => {
      console.log('error deleting account');
    }
  }
  this.email = (name, email, subject, message, url) => {
    const sendMessage = 'contact: ' + email + ' message: ' + message;

    const data = {
      name: name,
      email: 'letsbuildyourwebsite@outlook.com',
      subject: subject,
      message: sendMessage
    }

    $http({
      method: 'POST',
      url: url,
      data: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    }).then(
        (success) => { successCallback(success) },
        (error) => { errorCallback(error.data) }
      );

    const successCallback = () => {
      console.log('email sent');
      $('.send-btn').removeClass('loader');
      $('.send-btn p').text('sent');
      $('.send-btn').addClass('emailSent');
      $('input').val('');
      $('textarea').val('');
      $timeout(() => {
        $('.send-btn p').text('send');
        $('.send-btn').removeClass('emailSent');
      }, 2000);
    }

    const errorCallback = (err) => {
      console.log(err);
      $('.send-btn p').text('error');
      $('.send-btn').addClass('errorSent');
      $timeout(() => {
        $('.send-btn p').text('send');
        $('.send-btn').removeClass('errorSent');
      }, 2000);
    }
  }
  this.text = (userName, userNumber, userMessage, url) => {
    const sendMessage = 'contact: ' + userNumber + ' message: ' + userMessage;

    const data = {
      userName: userName,
      userNumber: '8147530157',
      userMessage: sendMessage,
    }

    $http({
      method: 'POST',
      url: url,
      data: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    }).then(
        (success) => { successCallback(success) },
        (error) => { errorCallback(error.data) }
      );

    const successCallback = () => {
      console.log('email sent');
      $('.send-text-btn').removeClass('loader');
      $('.send-text-btn p').text('sent');
      $('.send-text-btn').addClass('emailSent');
      $('input').val('');
      $('textarea').val('');
      $timeout(() => {
        $('.send-text-btn p').text('send');
        $('.send-text-btn').removeClass('emailSent');
      }, 2000);
    }

    const errorCallback = (err) => {
      console.log('email sent');
      $('.send-text-btn').removeClass('loader');
      $('.send-text-btn p').text('sent');
      $('.send-text-btn').addClass('emailSent');
      $('input').val('');
      $('textarea').val('');
      $timeout(() => {
        $('.send-text-btn p').text('send');
        $('.send-text-btn').removeClass('emailSent');
      }, 2000);
    }
  }
  this.setUserInfo = (userObj) => {
    $rootScope.user_firstname = userObj.data.firstname;
    $rootScope.user_lastname = userObj.data.lastname;
    $rootScope.user_name = userObj.data.username;
    $rootScope._id = userObj.data._id;
  };
});

app.service('auth', function($rootScope, $timeout){
  this.logIn = () => {
    $rootScope.auth = true;

    $('.homeImg').animate({ left: '100vw' });
    $('.form-view').fadeOut();
    $('.nav-circle').addClass('pointer');
    $('html').removeClass('noScroll');
    $('.slideText').css('left', '2em');
    $('.slide-show').css('left', '2em');
    $('body').removeClass('noScroll').addClass('noScrollX');
    $rootScope.loggedIn = true;

    $timeout(() => {
      $('.slideText').animate({ left: 0, opacity: 1 }, 500);
      $('.slide-show').animate({ left: 0, opacity: 1 }, 500);
    }, 500);
    $timeout(() => {
      $('.page2').animate({ top: 0 }, 500);console.log(window.innerWidth);
      if(window.innerWidth > 1310){
        $('.navigation').hide().removeClass('opacityZero').fadeIn(1000);
      } else {
        $('.navigation').hide().css("display", "").addClass('none').removeClass('opacityZero');
      }
      $('.nav-circle.five').css('opacity', 1);
    }, 1000);
  }
  this.signIn = () => {
    $('input').val('');
    //$('.signup').fadeOut();
    $('#firstname').addClass('none');
    $('#lastname').addClass('none');
    $('.page1 form').removeClass('signUpForm');
    $('.page1 form').addClass('signInForm');
    $timeout(() => { $('.form-view').fadeIn() }, 1100);
  }
});
