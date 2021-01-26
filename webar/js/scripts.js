      function select_src() {
         $("#model").attr("src", $("#select_src").val());
      }

      function expos() {
         val = $('#slider-exposure').val();
         $('#exposure-value').val(val);
         $("#model").attr("exposure", val);
      }
      function shad_inten() {
         val = $('#slider-shadow-intensity').val();
         $('#shadow-intensity-value').val(val);
         $("#model").attr("shadow-intensity", val);
      }
      function shad_soft() {
         val = $('#slider-shadow-softness').val();
         $('#shadow-softness-value').val(val);
         $("#model").attr("shadow-softness", val);
      }
      function select_menu() {
         if ($("#select").val() != 0)
            $("#model").attr("skybox-image", $("#select").val());
         else
            $("#model").removeAttr("skybox-image");
      }
      function activate_autorot() {
         if ($("#auto-rot").is(":checked")) {
            $("#model").attr("auto-rotate", "");
            $("#auto-rot").attr("checked", 1);
         }
         else {
            $("#model").removeAttr("auto-rotate");
            $("#auto-rot").removeAttr("checked");
         }
      }

      function cam_orb() {
         val_x = $('#camera-orbit-x').val();
         $('#camera-orbit-x-value').val(val_x);
         val_y = $('#camera-orbit-y').val();
         $('#camera-orbit-y-value').val(val_y);
         val_dist = $('#camera-orbit-dist').val();
         $('#camera-orbit-dist-value').val(val_dist);
         $("#model").attr("camera-orbit", val_x + "deg" + val_y + "deg" + val_dist + "m");
      }

      function fov() {
         val = $('#field-of-view').val();
         $('#field-of-view-value').val(val);
         $("#model").attr("field-of-view", val + "deg");
      }