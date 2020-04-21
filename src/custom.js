
$(function() {
    $( "#sortable1, #sortable2 , #sortable3"  ).sortable({
      connectWith: ".connectedSortable",
      stop: function(event , ui) {

        var carriedNote = ui.item.children("i").show();
        //get item text and find note_state then update note_state
        var changedNote = ui.item.children("p").text();
        var element =$("p:contains(" + changedNote + ")");
        var segmentId = element.parent().parent().attr('id');
        
        for(var i = 0; i < storedNotes.queue.length; i++) {
          if(changedNote == storedNotes.queue[i].note_data){
            if(segmentId == "sortable1"){
              storedNotes.queue[i].note_state = 0
              localStorage.setItem('notes', JSON.stringify(storedNotes));
            }
            else if(segmentId == "sortable2"){
              storedNotes.queue[i].note_state = 1
              localStorage.setItem('notes', JSON.stringify(storedNotes));
            }
            else if(segmentId == "sortable3"){
              storedNotes.queue[i].note_state = 2
              localStorage.setItem('notes', JSON.stringify(storedNotes));
            }
          }
        }
        //sort elements after each sort event
        sortNote();
      },

      start: function(event , ui) {
        var carriedNote = ui.item.children("i").hide();
        console.log(carriedNote);
      }
    }).disableSelection();
  } );
 
  var notes;
  var storedNotes;

  notes = JSON.parse(localStorage.getItem('notes'));  

  if(notes == null){
      notes = {
          queue: [
              {id : 0 , note_state : 0 , note_data : "First note..." },
          ]
      };        
      localStorage.setItem('notes', JSON.stringify(notes));
  }

  storedNotes = JSON.parse(localStorage.getItem('notes'));  

  function sortNote(){

    var list_items = document.querySelectorAll("li");

        
    for(var i = 0 ; i < list_items.length ; i++){

      //burada benim ilk itemim queue nin ilk itemi olacak neden mi çünkü notlar queue sıralamasına göre değiştiriliyor

      storedNotes.queue[i].id = i;
      storedNotes.queue[i].note_data = list_items[i].children[0].innerHTML;
      
      if(list_items[i].parentElement.id == "sortable1") {
        storedNotes.queue[i].note_state = 0;
      }
      else if(list_items[i].parentElement.id == "sortable2"){
        storedNotes.queue[i].note_state = 1;
      } 
      else if(list_items[i].parentElement.id == "sortable3"){
        storedNotes.queue[i].note_state = 2;
      }
    }

    localStorage.setItem('notes', JSON.stringify(storedNotes));

  }
  function reloadList() {

    for (let i = 0 ; i < storedNotes.queue.length ; i++) {
                
      var inputText = $("<p class='input-text'></p>").text(storedNotes.queue[i].note_data);

      inputText.dblclick(function(){
        
      var tempValue = $(this).text();
      $(this).text("");
      var input = $("<textarea  class='update-todo'> style='' ").val(tempValue);
      input.width($(this).width());
      input.height(50);
      $(this).append(input);
      input.focus();
      input.focusout(function(){

          storedNotes.queue[i].note_data = $(this).val();
          localStorage.setItem('notes', JSON.stringify(storedNotes));
          $(this).parent().text($(this).val());       

      });
      });


      var list_item = $("<li class='ui-state-default'></li>");
      var deleteButton = $("<i class='delete-button'><svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' ><path d='M3 6v18h18v-18h-18zm5 14c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4-18v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2h5.712z'/></svg></i>").click(function() {

      var p = $(this).parent();
      var other_child = p.children( ".input-text");
      
      for (let index = 0; index < storedNotes.queue.length; index++) {
          if(other_child.text() == storedNotes.queue[index].note_data){
              storedNotes.queue.splice(index, 1);
              localStorage.setItem('notes', JSON.stringify(storedNotes));
          }
      }
      p.fadeOut("fast" , function() {
          p.remove();
      })
      });

      list_item.append(inputText , deleteButton);

      if(storedNotes.queue[i].note_state == 0){
      
        $("#sortable1").append(list_item);
      
      }
      else if(storedNotes.queue[i].note_state == 1){
      
        $("#sortable2").append(list_item);
      
      }
      else if(storedNotes.queue[i].note_state == 2){
      
        $("#sortable3").append(list_item);

      } 
    }
  }


  reloadList();
  
  function removeList(){
    $("#sortable1").empty();
    $("#sortable2").empty();
    $("#sortable3").empty();

  }
  

  $(".todo-btn").click(function(){
    var a = $(".todo-input").val();
    var noteList = [];
    for (let index = 0; index < storedNotes.queue.length; index++) {
        noteList.push(storedNotes.queue[index].note_data);
    }
    
    if(a != "" && !noteList.includes(a)){

      storedNotes.queue.push({
        id : storedNotes.queue.length ,
        note_state : 0,
        note_data : a
      });

      localStorage.setItem('notes', JSON.stringify(storedNotes));
      removeList();
      reloadList();

    }
  });


