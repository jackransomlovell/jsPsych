var video = ['examples/video/sample_video.mp4']
var preload = {
  type: 'preload',
  video: video
} 
var trial_1 = {
  type: 'collab-filtering',
  videos: [{stimulus:'examples/video/sample_video.mp4'}],
  pause_questions: [{prompt:'whatcha think'},
                    {prompt:'now, tell me how ya really feel'}],
  end_questions: [{prompt:'whatcha think'},
                    {prompt:'now, tell me how ya really feel'}]
}
jsPsych.init({
  timeline: [preload,trial_1]
});