/*
 * Example plugin template
 */

jsPsych.plugins['collab-filtering'] = (function() {

  var plugin = {};

  plugin.info = {
    name: "collab-filtering",
    parameters: {
      videos: {
        type: jsPsych.plugins.parameterType.COMPLEX, // BOOL, STRING, INT, FLOAT, FUNCTION, KEY, SELECT, HTML_STRING, IMAGE, AUDIO, VIDEO, OBJECT, COMPLEX
        array: true,
        pretty_name: 'Videos',
        nested:{
          stimulus: {
            type: jsPsych.plugins.parameterType.VIDEO,
            pretty_name: 'Videos',
            default: undefined,
            description: 'Videos to be displayed'
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
            default: 10,
            description: 'Minimum time to stop the clip.'
          },
          max_stop: { 
            type: jsPsych.plugins.parameterType.FLOAT,
            pretty_name: 'Stop',
            default: 10,
            description: 'Maximum time to stop the clip, default is the duration of the video minus ten seconds. '
          }
        }
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

    // setup stimulus
    var video_html = '<div>'
    video_html += '<video id="jspsych-collab-filtering-pause-stimulus"';

    if(trial.videos.width) {
      video_html += ' width="'+trial.videos.width+'"';
    }
    if(trial.videos.height) {
      video_html += ' height="'+trial.videos.height+'"';
    }

    // automatically start at the beginning of the video
    video_html += " autoplay ";

    if(trial.videos.controls){
      video_html +=" controls ";
    }
    
    video_html +=">";

    var video_preload_blob = jsPsych.pluginAPI.getVideoBuffer(trial.videos.stimulus[0]);
    if(!video_preload_blob) {
      for(var i=0; i<trial.videos.stimulus.length; i++){
        var file_name = trial.videos.stimulus[i];
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
    if (trial.videos.prompt !== null) {
      video_html += trial.videos.prompt;
    }

    display_element.innerHTML = video_html;

    var video_element = display_element.querySelector('#jspsych-collab-filtering-pause-stimulus');

    if(video_preload_blob){
      video_element.src = video_preload_blob;
    }

    function rand_stop(video){
      // check to see if it is video_elem.
      try{
        if(video.tagName != 'div') throw 'video_element not actually a div'
      }
      catch(err){
        message.innerHTML = "Video is" + video.tagName
      }
      // get video duration
      var duration = video.duration;
      //specify the max time
      var max = duration - trial.videos.max_stop
      //specify the minimum time
      var min = trial.videos.min_stop;
      //check if the number is greater than 0
      try {
        var diff = max - min
        if(diff <= 0) throw "duration is not greater than the difference between start and end, please choose a different video"
      }
      catch(err){
        message.innerHTML = "Difference between start and end is" + diff;
      }
      //get a ranom number 
      var rand_pause = Math.random() * (max-min) + min
      return rand_pause
    }

    // get random pause and push to global array for data writing and resuming the video
    var pauses = [];
    var pausetime = rand_stop(video_element);
    pauses.push(pausetime)


    // end first video portion of the experiment
    video_element.addEventListener('timeupdate', function(e){
      var currenttime = video_element.currentTime;
      if(currenttime >= pausetime){
        // clear the display
        display_element.innerHTML = '';
      }
    })


    //start pause slider session
    var w = '100%';
  
    var html = "";
    // inject CSS for trial
    html += '<style id="jspsych-collab-filtering-pause-slider-css">';
    html += ".jspsych-multiple-slider-statement { display:block; font-size: 16px; padding-top: 40px; margin-bottom:10px; }"+
      ".jspsych-multiple-slider-opts { list-style:none; width:"+w+"; margin:auto; padding:0 0 35px; display:block; font-size: 14px; line-height:1.1em; }"+
      ".jspsych-multiple-slider-opt-label { line-height: 1.1em; color: #444; }"+
      ".jspsych-multiple-slider-opts:before { content: ''; position:relative; top:11px; /*left:9.5%;*/ display:block; background-color:#efefef; height:4px; width:100%; }"+
      ".jspsych-multiple-slider-opts:last-of-type { border-bottom: 0; }"+
      ".jspsych-multiple-slider-opts li { display:inline-block; /*width:19%;*/ text-align:center; vertical-align: top; }"+
      ".jspsych-multiple-slider-opts li input[type=radio] { display:block; position:relative; top:0; left:50%; margin-left:-6px; }"
    html += '</style>';
  
    // show preamble text
    if(trial.pause_preamble !== null){
      html += '<div id="jspsych-collab-filtering-slider-pause-preamble" class="jspsych-collab-filtering-slider-pause-preamble">'+trial.pause_preamble+'</div>';
    }
  
    if ( trial.autocomplete ) {
      html += '<form id="jspsych-collab-filtering-slider-pause-form">';
    } else {
      html += '<form id="jspsych-collab-filtering-slider-pause-form" autocomplete="off">';
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
      html += '<label class="jspsych-collab-filtering-slider-pause-statement">' + pause_question.prompt + '</label>';
  
      // add labels
      html += '<div id="jspsych-collab-filtering-slider-pause-response-wrapper" style="margin: 0px 0px;">';
      html += '<div class="jspsych-collab-filtering-slider-pause-response-container" style="position:relative; margin: 0 auto 3em auto; ';
      html += 'width:'+trial.slider_width+'px;';
      html += '">';
      html += '<div>';
      for(var j=0; j < pause_question.labels.length; j++){
        var width = 100/(pause_question.labels.length-1);
        var left_offset = (j * (100 /(pause_question.labels.length - 1))) - (width/2);
        html += '<div style="display: inline-block; position: absolute; left:'+left_offset+'%; text-align: center; width: '+width+'%;">';
        html += '<span style="text-align: center; font-size: 80%; color: grey">'+pause_question.labels[j]+'</span>';
        html += '</div>'
      }
      html += '</div>';
  
      // add some space between sliders and the labels
      html += '<br/>';
  
      // add sliders
      html += '<input type="range" value="'+pause_question.slider_start+'" min="'+pause_question.min+'" max="'+pause_question.max+'" step="'+pause_question.step+'" style="width: 100%;" class="jspsych-collab-filtering-slider-pause-response-response" id="jspsych-collab-filtering-slider-pause-response-response'+i+'" name="Q'+i+'" data-name="'+pause_question.name+'"></input>';
      // add some space between the sliders
      html += '<br/>';
    }
  
    // add some space before the next button
    html += '<br/>'
  
    // add submit button
    html += '<input type="submit" id="jspsych-collab-filtering-slider-pause-next" class="jspsych-collab-filtering-pause-slider jspsych-btn" value="'+trial.button_label+'"></input>';
  
    html += '</form>'
  
    display_element.innerHTML = html;
  
    // require responses
    if (trial.require_movement) {
      // disable by default the next button
      document.getElementById("jspsych-collab-filtering-slider-pause-next").disabled = true;
  
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
          document.getElementById("jspsych-collab-filtering-slider-pause-next").disabled = false;
        }
      }
  
      var all_sliders = document.querySelectorAll(".jspsych-collab-filtering-slider-pause-next");
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
      var endTime = performance.now();
      var response_time = endTime - startTime;
  
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

      display_element.innerHTML = '';
    });

    //SECOND VIDEO AND LAST TRIAL
    // setup stimulus
    var video_html = '<div>'
    video_html += '<video id="jspsych-collab-filtering-end-stimulus"';

    if(trial.videos.width) {
      video_html += ' width="'+trial.videos.width+'"';
    }
    if(trial.videos.height) {
      video_html += ' height="'+trial.videos.height+'"';
    }

    // automatically start at the beginning of the video
    video_html += " autoplay ";

    if(trial.videos.controls){
      video_html +=" controls ";
    }
    
    video_html +=">";

    var video_preload_blob = jsPsych.pluginAPI.getVideoBuffer(trial.videos.stimulus[0]);
    if(!video_preload_blob) {
      for(var i=0; i<trial.stimulus.length; i++){
        var file_name = trial.stimulus[i];
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

    var video_element = display_element.querySelector('#jspsych-collab-filtering-end-stimulus');

    if(video_preload_blob){
      video_element.src = video_preload_blob;
    }

    video_element.pause();
    video_element.currentTime = pauses[pauses.length-1];
    video_element.onseeked = function() {
        video_element.style.visibility = "visible";
        video_element.play();
    }

    // end second video portion of the experiment

    video_element.onended = function(){
      display_element.innerHTML = '';
    }

    ////START END SLIDER SESSION

    
    var w = '100%';
  
    var html = "";
    // inject CSS for trial
    html += '<style id="jspsych-collab-filtering-end-slider-css">';
    html += ".jspsych-multiple-slider-statement { display:block; font-size: 16px; padding-top: 40px; margin-bottom:10px; }"+
      ".jspsych-multiple-slider-opts { list-style:none; width:"+w+"; margin:auto; padding:0 0 35px; display:block; font-size: 14px; line-height:1.1em; }"+
      ".jspsych-multiple-slider-opt-label { line-height: 1.1em; color: #444; }"+
      ".jspsych-multiple-slider-opts:before { content: ''; position:relative; top:11px; /*left:9.5%;*/ display:block; background-color:#efefef; height:4px; width:100%; }"+
      ".jspsych-multiple-slider-opts:last-of-type { border-bottom: 0; }"+
      ".jspsych-multiple-slider-opts li { display:inline-block; /*width:19%;*/ text-align:center; vertical-align: top; }"+
      ".jspsych-multiple-slider-opts li input[type=radio] { display:block; position:relative; top:0; left:50%; margin-left:-6px; }"
    html += '</style>';
      
    // show preamble text
    if(trial.pause_preamble !== null){
      html += '<div id="jspsych-collab-filtering-slider-end-preamble" class="jspsych-collab-filtering-slider-end-preamble">'+trial.end_preamble+'</div>';
    }
      
    if ( trial.autocomplete ) {
      html += '<form id="jspsych-collab-filtering-slider-end-form">';
    } else {
      html += '<form id="jspsych-collab-filtering-slider-end-form" autocomplete="off">';
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
      html += '<label class="jspsych-collab-filtering-end-slider-statement">' + end_question.prompt + '</label>';
      
      // add labels
      html += '<div id="jspsych-collab-filtering-slider-end-response-wrapper" style="margin: 0px 0px;">';
      html += '<div class="jspsych-collab-filtering-slider-end-response-container" style="position:relative; margin: 0 auto 3em auto; ';
      html += 'width:'+trial.slider_width+'px;';
      html += '">';
      html += '<div>';
      for(var j=0; j < end_question.labels.length; j++){
        var width = 100/(end_question.labels.length-1);
        var left_offset = (j * (100 /(end_question.labels.length - 1))) - (width/2);
        html += '<div style="display: inline-block; position: absolute; left:'+left_offset+'%; text-align: center; width: '+width+'%;">';
        html += '<span style="text-align: center; font-size: 80%; color: grey">'+end_question.labels[j]+'</span>';
        html += '</div>'
      }
      html += '</div>';
      
      // add some space between sliders and the labels
      html += '<br/>';
      
      // add sliders
      html += '<input type="range" value="'+end_question.slider_start+'" min="'+end_question.min+'" max="'+end_question.max+'" step="'+end_question.step+'" style="width: 100%;" class="jspsych-collab-filtering-slider-end-response-response" id="jspsych-collab-filtering-slider-end-response-response'+i+'" name="Q'+i+'" data-name="'+end_question.name+'"></input>';
      // add some space between the sliders
      html += '<br/>';
    }
      
    // add some space before the next button
    html += '<br/>'
      
    // add submit button
    html += '<input type="submit" id="jspsych-collab-filtering-end-slider-next" class="jspsych-collab-filtering-end-slider jspsych-btn" value="'+trial.button_label+'"></input>';
      
    html += '</form>'
      
    display_element.innerHTML = html;
      
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
      var endTime = performance.now();
      var response_time = endTime - startTime;
      
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
    
      display_element.innerHTML = '';
    });
    
    // clear the display
    display_element.innerHTML = '';

    // data saving
    var trial_data = {
      parameter_name: 'parameter value'
    };

    // end trial
    jsPsych.finishTrial(trial_data)
  };

  return plugin;

})();
