/*
 * collab-filtering
 */

jsPsych.plugins['collab-filtering'] = (function() {

  var plugin = {};

  jsPsych.pluginAPI.registerPreload('collab-filtering', 'stimulus', 'video');

  plugin.info = {
    name: "collab-filtering",
    parameters: {
      stimulus: {
        type: jsPsych.plugins.parameterType.VIDEO,
        pretty_name: 'Video',
        default: undefined,
        description: 'The video file to play.'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed below the buttons.'
      },
      width: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Width',
        default: '',
        description: 'The width of the video in pixels.'
      },
      height: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Height',
        default: '',
        description: 'The height of the video display in pixels.'
      },
      autoplay: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Autoplay',
        default: true,
        description: 'If true, the video will begin playing as soon as it has loaded.'
      },
      controls: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Controls',
        default: false,
        description: 'If true, the subject will be able to pause the video or move the playback to any point in the video.'
      },
      min_stop: {
        type: jsPsych.plugins.parameterType.FLOAT,
        pretty_name: 'Start',
        default: null,
        description: 'Time to start the clip.'
      },
      max_stop: {
        type: jsPsych.plugins.parameterType.FLOAT,
        pretty_name: 'Stop',
        default: null,
        description: 'Time to stop the clip.'
      },
      ranomize_video_order:{
        type:jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Randomize Video Order',
        default: false,
        description: 'Whether or not to randomize video order'
      },
      pause_questions: {
        type: jsPsych.plugins.parameterType.COMPLEX,
        array: true,
        pretty_name: 'Pause Questions',
        nested: {
          prompt: {
            type: jsPsych.plugins.parameterType.STRING,
            pretty_name: 'Prompt',
            default: undefined,
            description: 'Questions that are associated with the slider.'
          },
          labels: {
            type: jsPsych.plugins.parameterType.STRING,
            pretty_name:'Labels',
            default: [],
            array: true,
            description: 'Labels of the sliders.',
          },
          name: {
            type: jsPsych.plugins.parameterType.STRING,
            pretty_name: 'Question Name',
            default: '',
            description: 'Controls the name of data values associated with this question'
          },
          min: {
            type: jsPsych.plugins.parameterType.INT,
            pretty_name: 'Min slider',
            default: 0,
            description: 'Sets the minimum value of the slider.'
          },
          max: {
            type: jsPsych.plugins.parameterType.INT,
            pretty_name: 'Max slider',
            default: 100,
            description: 'Sets the maximum value of the slider',
          },
          slider_start: {
            type: jsPsych.plugins.parameterType.INT,
            pretty_name: 'Slider starting value',
            default: 50,
            description: 'Sets the starting value of the slider',
          },
          step: {
            type: jsPsych.plugins.parameterType.INT,
            pretty_name: 'Step',
            default: 1,
            description: 'Sets the step of the slider'
          }
        }
      },
      end_questions: {
        type: jsPsych.plugins.parameterType.COMPLEX,
        array: true,
        pretty_name: 'Questions',
        nested: {
          prompt: {
            type: jsPsych.plugins.parameterType.STRING,
            pretty_name: 'Prompt',
            default: undefined,
            description: 'Questions that are associated with the slider.'
          },
          labels: {
            type: jsPsych.plugins.parameterType.STRING,
            pretty_name:'Labels',
            default: [],
            array: true,
            description: 'Labels of the sliders.',
          },
          name: {
            type: jsPsych.plugins.parameterType.STRING,
            pretty_name: 'Question Name',
            default: '',
            description: 'Controls the name of data values associated with this question'
          },
          min: {
            type: jsPsych.plugins.parameterType.INT,
            pretty_name: 'Min slider',
            default: 0,
            description: 'Sets the minimum value of the slider.'
          },
          max: {
            type: jsPsych.plugins.parameterType.INT,
            pretty_name: 'Max slider',
            default: 100,
            description: 'Sets the maximum value of the slider',
          },
          slider_start: {
            type: jsPsych.plugins.parameterType.INT,
            pretty_name: 'Slider starting value',
            default: 50,
            description: 'Sets the starting value of the slider',
          },
          step: {
            type: jsPsych.plugins.parameterType.INT,
            pretty_name: 'Step',
            default: 1,
            description: 'Sets the step of the slider'
          }
        }
      },
      randomize_question_order: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Randomize Question Order',
        default: false,
        description: 'If true, the order of the questions will be randomized'
      },
      pause_preamble: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Preamble',
        default: null,
        description: 'String to display at top of the page for pause set of questions.'
      },
      end_preamble: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Preamble',
        default: null, // is this correct??
        description: 'String to display at top of the page for end set of questions. Set to pause by default'
      },
      button_label: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button label',
        default:  'Continue',
        description: 'Label of the button.'
      },
      autocomplete: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Allow autocomplete',
        default: false,
        description: "Setting this to true will enable browser auto-complete or auto-fill for the form."
      },
      require_movement: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Require movement',
        default: false,
        description: 'If true, the participant will have to move the slider before continuing.'
      },
      slider_width: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name:'Slider width',
        default: 500,
        description: 'Width of the slider in pixels.'
      }
    }
  }

  plugin.trial = function(display_element, trial) {
    
    //function to build html5 vieo element
    function build_video(){
      // setup stimulus
      var video_html = '<div>'
      video_html += '<video id="jspsych-collab-filtering-pause-stimulus"';

      if(trial.width) {
        video_html += ' width="'+trial.width+'"';
      }
      if(trial.height) {
        video_html += ' height="'+trial.height+'"';
      }

      // automatically start at the beginning of the video
      video_html += " autoplay ";

      if(trial.controls){
        video_html +=" controls ";
      }

      video_html +=">";

      var video_preload_blob = jsPsych.pluginAPI.getVideoBuffer(trial.stimulus);
      if(!video_preload_blob) {
        for(var i=0; i<trial.stimulus.length; i++){
          var file_name = trial.videos[i].stimulus;
          if(file_name.indexOf('?') > -1){
            file_name = file_name.substring(0, file_name.indexOf('?'));
          }
          var type = file_name.substr(file_name.lastIndexOf('.') + 1);
          type = type.toLowerCase();
          if (type == "mov") {
            console.warn('Warning: collab-filtering plugin does not reliably support .mov files.')
          }
          video_html+='<source src="' + file_name + '" type="video/'+type+'">';   
        }
      }
      video_html += "</video>";
      video_html += "</div>";

      // add prompt if there is one
      if (trial.prompt !== null) {
        video_html += trial.prompt;
      }

      display_element.innerHTML = video_html;

      var video_element = display_element.querySelector('#jspsych-collab-filtering-pause-stimulus');

      if(video_preload_blob){
        video_element.src = video_preload_blob;
      }

      return  video_element
    }
    
    //get video element
    var video_element = build_video()

    //create random stop
    function rand_stop(vid_id){
      var vid = document.getElementById(vid_id)
      // get video duration
      var duration = vid.duration;
      //specify the max time
      var max = duration - trial.max_stop
      //specify the minimum time
      var min = trial.min_stop;
      //get a ranom number 
      var rand_pause = Math.random() * (max-min) + min
      return rand_pause
    }
    
    //pauses
    var pauses=[]

    //pause the video at a random point
    function pause_video(video_element){
      //check if video is loaded
      var video = document.getElementById('jspsych-collab-filtering-pause-stimulus')
      if(video.readyState == 4){
        // get random pause 
        var pausetime = rand_stop('jspsych-collab-filtering-pause-stimulus');
        console.log('duration')
        console.log(document.getElementById('jspsych-collab-filtering-pause-stimulus').duration)
        console.log('random stop')
        console.log(pausetime)
        pauses.push(pausetime)
        // end first video portion of the experiment
        video_element.addEventListener('timeupdate', function(e){
          var currenttime = video_element.currentTime;
          if(currenttime >= pausetime){
            // clear the display
            display_element.innerHTML = '';
          }
        })
      }
    }
    pause_video(video_element)

    //build pause slider
    function pause_slider(){
      if(display_element.innerHTML == ''){
        //start pause slider session
        var w = '100%';
        
        var pause_slider_element = "";
        // inject CSS for trial
        pause_slider_element += '<style id="jspsych-collab-filtering-pause-slider-css">';
        pause_slider_element += ".jspsych-multiple-slider-statement { display:block; font-size: 16px; padding-top: 40px; margin-bottom:10px; }"+
          ".jspsych-multiple-slider-opts { list-style:none; width:"+w+"; margin:auto; padding:0 0 35px; display:block; font-size: 14px; line-height:1.1em; }"+
          ".jspsych-multiple-slider-opt-label { line-height: 1.1em; color: #444; }"+
          ".jspsych-multiple-slider-opts:before { content: ''; position:relative; top:11px; /*left:9.5%;*/ display:block; background-color:#efefef; height:4px; width:100%; }"+
          ".jspsych-multiple-slider-opts:last-of-type { border-bottom: 0; }"+
          ".jspsych-multiple-slider-opts li { display:inline-block; /*width:19%;*/ text-align:center; vertical-align: top; }"+
          ".jspsych-multiple-slider-opts li input[type=radio] { display:block; position:relative; top:0; left:50%; margin-left:-6px; }"
          pause_slider_element += '</style>';
        
        // show preamble text
        if(trial.pause_preamble !== null){
          pause_slider_element += '<div id="jspsych-collab-filtering-slider-pause-preamble" class="jspsych-collab-filtering-slider-pause-preamble">'+trial.pause_preamble+'</div>';
        }
      
        if ( trial.autocomplete ) {
          pause_slider_element += '<form id="jspsych-collab-filtering-slider-pause-form">';
        } else {
          pause_slider_element += '<form id="jspsych-collab-filtering-slider-pause-form" autocomplete="off">';
        }
      
        // add sliders questions ///
        // generate question order. this is randomized here as opposed to randomizing the order of trial.questions
        // so that the data are always associated with the same question regardless of order
        var pause_question_order = [];
        for(var i=0; i<trial.pause_questions.length; i++){
          pause_question_order.push(i);
        }
        if(trial.randomize_question_order){
          pause_question_order = jsPsych.randomization.shuffle(pause_question_order);
        }
      
        for (var i = 0; i < trial.pause_questions.length; i++) {
          var pause_question = trial.pause_questions[pause_question_order[i]];
          // add question
          pause_slider_element += '<label class="jspsych-collab-filtering-slider-pause-statement">' + pause_question.prompt + '</label>';
        
          // add labels
          pause_slider_element += '<div id="jspsych-collab-filtering-slider-pause-response-wrapper" style="margin: 0px 0px;">';
          pause_slider_element += '<div class="jspsych-collab-filtering-slider-pause-response-container" style="position:relative; margin: 0 auto 3em auto; ';
          pause_slider_element += 'width:'+trial.slider_width+'px;';
          pause_slider_element += '">';
          pause_slider_element += '<div>';
          for(var j=0; j < pause_question.labels.length; j++){
            var width = 100/(pause_question.labels.length-1);
            var left_offset = (j * (100 /(pause_question.labels.length - 1))) - (width/2);
            pause_slider_element += '<div style="display: inline-block; position: absolute; left:'+left_offset+'%; text-align: center; width: '+width+'%;">';
            pause_slider_element += '<span style="text-align: center; font-size: 80%; color: grey">'+pause_question.labels[j]+'</span>';
            pause_slider_element += '</div>'
          }
          pause_slider_element += '</div>';
        
          // add some space between sliders and the labels
          pause_slider_element += '<br/>';
        
          // add sliders
          pause_slider_element += '<input type="range" value="'+pause_question.slider_start+'" min="'+pause_question.min+'" max="'+pause_question.max+'" step="'+pause_question.step+'" style="width: 100%;" class="jspsych-collab-filtering-slider-pause-response-response" id="jspsych-collab-filtering-slider-pause-response-response'+i+'" name="Q'+i+'" data-name="'+pause_question.name+'"></input>';
          // add some space between the sliders
          pause_slider_element += '<br/>';
        }
      
        // add some space before the next button
        pause_slider_element += '<br/>'
      
        // add submit button
        pause_slider_element += '<input type="submit" id="jspsych-collab-filtering-slider-pause-next" class="jspsych-collab-filtering-pause-slider jspsych-btn" value="'+trial.button_label+'"></input>';
      
        pause_slider_element += '</form>'
      
        display_element.innerHTML = pause_slider_element;
        
      
        // require responses
        if (trial.require_movement) {
          // disable by default the next button
          document.getElementById("jspsych-collab-filtering-pause-slider-next").disabled = true;

          // check whether all sliders have been clicked
          function check_reponses() {
            var all_sliders = document.querySelectorAll(".jspsych-collab-filtering-slider-pause-response-response");
            var all_clicked = true;
            for (var i=0; i<all_sliders.length; i++) {
                if (!all_sliders[i].classList.contains("clicked")) {
                    // if any one slider doesn't have the 'clicked' class, then we know that they haven't all been clicked
                    all_clicked = false;
                    break;
                }
            }
            if (all_clicked) {
              // if they have been clicked then enable the next button
              document.getElementById("jspsych-collab-filtering-pause-slider-next").disabled = false;
            }
          }
        
          var all_sliders = document.querySelectorAll(".jspsych-collab-filtering-pause-slider-next");
          all_sliders.forEach(function(slider) {
              slider.addEventListener('click', function() {
                slider.classList.add("clicked"); // record the fact that this slider has been clicked
                check_reponses(); // each time a slider is clicked, check to see if they've all been clicked
              });
          });
        }

        display_element.querySelector("#jspsych-collab-filtering-slider-pause-form").addEventListener('submit', function(e){
          e.preventDefault();
          // measure response time
          // create object to hold responses
          var question_data = {};
      
          // hold responses
          var matches = display_element.querySelectorAll('input[type="range"]');
      
      
          // store responses
          for(var index = 0; index < matches.length; index++){
            var id = matches[index].name;
            var response = matches[index].valueAsNumber;
            var obje = {};
            if(matches[index].attributes['data-name'].value !== ''){
              var name = matches[index].attributes['data-name'].value;
            } else {
              var name = id;
            }
            obje[name] = response;
            Object.assign(question_data, obje);
          }
        });

        display_element.innerHTML = '';
      }
    }
    pause_slider()

    //SECOND VIDEO AND LAST TRIAL
    // resume video and end at the end of the stimulus
    function end_video(element){
      if(display_element.innerHTML == ''){
        display_element.innerHTML = element;
        video_element.pause();
        video_element.currentTime = pauses[pauses.length-1];
        video_element.onseeked = function() {
          video_element.style.visibility = "visible";
          video_element.play();
          }
      }
      // end second video portion of the experiment
      video_element.onended = function(){
      display_element.innerHTML = '';
      }
    }
    end_video(video_element)

    ////START END SLIDER SESSION
    function end_slider(){
      if(display_element.innerHTML == ''){
        //start end slider session
        var w = '100%';
        
        var end_slider_element = "";
        // inject CSS for trial
        end_slider_element += '<style id="jspsych-collab-filtering-end-slider-css">';
        end_slider_element += ".jspsych-multiple-slider-statement { display:block; font-size: 16px; padding-top: 40px; margin-bottom:10px; }"+
          ".jspsych-multiple-slider-opts { list-style:none; width:"+w+"; margin:auto; padding:0 0 35px; display:block; font-size: 14px; line-height:1.1em; }"+
          ".jspsych-multiple-slider-opt-label { line-height: 1.1em; color: #444; }"+
          ".jspsych-multiple-slider-opts:before { content: ''; position:relative; top:11px; /*left:9.5%;*/ display:block; background-color:#efefef; height:4px; width:100%; }"+
          ".jspsych-multiple-slider-opts:last-of-type { border-bottom: 0; }"+
          ".jspsych-multiple-slider-opts li { display:inline-block; /*width:19%;*/ text-align:center; vertical-align: top; }"+
          ".jspsych-multiple-slider-opts li input[type=radio] { display:block; position:relative; top:0; left:50%; margin-left:-6px; }"
          end_slider_element += '</style>';
        
        // show preamble text
        if(trial.end_preamble !== null){
          end_slider_element += '<div id="jspsych-collab-filtering-slider-end-preamble" class="jspsych-collab-filtering-slider-end-preamble">'+trial.end_preamble+'</div>';
        }
      
        if ( trial.autocomplete ) {
          end_slider_element += '<form id="jspsych-collab-filtering-slider-end-form">';
        } else {
          end_slider_element += '<form id="jspsych-collab-filtering-slider-end-form" autocomplete="off">';
        }
      
        // add sliders questions ///
        // generate question order. this is randomized here as opposed to randomizing the order of trial.questions
        // so that the data are always associated with the same question regardless of order
        var end_question_order = [];
        for(var i=0; i<trial.end_questions.length; i++){
          end_question_order.push(i);
        }
        if(trial.randomize_question_order){
          end_question_order = jsPsych.randomization.shuffle(end_question_order);
        }
      
        for (var i = 0; i < trial.end_questions.length; i++) {
          var end_question = trial.end_questions[end_question_order[i]];
          // add question
          end_slider_element += '<label class="jspsych-collab-filtering-slider-end-statement">' + end_question.prompt + '</label>';
        
          // add labels
          end_slider_element += '<div id="jspsych-collab-filtering-slider-end-response-wrapper" style="margin: 0px 0px;">';
          end_slider_element += '<div class="jspsych-collab-filtering-slider-end-response-container" style="position:relative; margin: 0 auto 3em auto; ';
          end_slider_element += 'width:'+trial.slider_width+'px;';
          end_slider_element += '">';
          end_slider_element += '<div>';
          for(var j=0; j < end_question.labels.length; j++){
            var width = 100/(end_question.labels.length-1);
            var left_offset = (j * (100 /(end_question.labels.length - 1))) - (width/2);
            end_slider_element += '<div style="display: inline-block; position: absolute; left:'+left_offset+'%; text-align: center; width: '+width+'%;">';
            end_slider_element += '<span style="text-align: center; font-size: 80%; color: grey">'+end_question.labels[j]+'</span>';
            end_slider_element += '</div>'
          }
          end_slider_element += '</div>';
        
          // add some space between sliders and the labels
          end_slider_element += '<br/>';
        
          // add sliders
          end_slider_element += '<input type="range" value="'+pause_question.slider_start+'" min="'+pause_question.min+'" max="'+pause_question.max+'" step="'+pause_question.step+'" style="width: 100%;" class="jspsych-collab-filtering-slider-pause-response-response" id="jspsych-collab-filtering-slider-pause-response-response'+i+'" name="Q'+i+'" data-name="'+pause_question.name+'"></input>';
          // add some space between the sliders
          end_slider_element += '<br/>';
        }
      
        // add some space before the next button
        end_slider_element += '<br/>'
      
        // add submit button
        end_slider_element += '<input type="submit" id="jspsych-collab-filtering-slider-end-next" class="jspsych-collab-filtering-end-slider jspsych-btn" value="'+trial.button_label+'"></input>';
      
        end_slider_element += '</form>'
      
        display_element.innerHTML = end_slider_element;
        
      
        // require responses
        if (trial.require_movement) {
          // disable by default the next button
          document.getElementById("jspsych-collab-filtering-end-slider-next").disabled = true;

          // check whether all sliders have been clicked
          function check_reponses() {
            var all_sliders = document.querySelectorAll(".jspsych-collab-filtering-slider-end-response-response");
            var all_clicked = true;
            for (var i=0; i<all_sliders.length; i++) {
                if (!all_sliders[i].classList.contains("clicked")) {
                    // if any one slider doesn't have the 'clicked' class, then we know that they haven't all been clicked
                    all_clicked = false;
                    break;
                }
            }
            if (all_clicked) {
              // if they have been clicked then enable the next button
              document.getElementById("jspsych-collab-filtering-end-slider-next").disabled = false;
            }
          }
        
          var all_sliders = document.querySelectorAll(".jspsych-collab-filtering-end-slider-next");
          all_sliders.forEach(function(slider) {
              slider.addEventListener('click', function() {
                slider.classList.add("clicked"); // record the fact that this slider has been clicked
                check_reponses(); // each time a slider is clicked, check to see if they've all been clicked
              });
          });
        }

        display_element.querySelector("#jspsych-collab-filtering-slider-end-form").addEventListener('submit', function(e){
          e.preventDefault();
          // measure response time
          // create object to hold responses
          var question_data = {};
      
          // hold responses
          var matches = display_element.querySelectorAll('input[type="range"]');
      
      
          // store responses
          for(var index = 0; index < matches.length; index++){
            var id = matches[index].name;
            var response = matches[index].valueAsNumber;
            var obje = {};
            if(matches[index].attributes['data-name'].value !== ''){
              var name = matches[index].attributes['data-name'].value;
            } else {
              var name = id;
            }
            obje[name] = response;
            Object.assign(question_data, obje);
          }
        });

        display_element.innerHTML = '';
      }
    }
    end_slider()
    // end trial
    jsPsych.finishTrial()
  }

  return plugin;

})();
