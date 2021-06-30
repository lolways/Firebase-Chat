window.onload = function (){
    //configuracion de firebase
    const firebaseConfig = {
        apiKey: "AIzaSyCJcvP96Yp4mflATereZ9WmLHMd3hCLTXY",
        authDomain: "blessed-chat-588b7.firebaseapp.com",
        databaseURL: "https://blessed-chat-588b7-default-rtdb.firebaseio.com",
        projectId: "blessed-chat-588b7",
        storageBucket: "blessed-chat-588b7.appspot.com",
        messagingSenderId: "21934670709",
        appId: "1:21934670709:web:417c39319cd6109076893c"
      };

      //inicializacion
      firebase.initializeApp(firebaseConfig)

      //base de datos 
      var db = firebase.database()


      class blessedchat{

        //pagina principal
        home(){
            document.body.innerHTML=''
            this.create_title()
            this.create_join_form()
        };

        //pagina de chat
        chat(){
            this.create_title()
            this.create_chat()
        };

        //creacion de titulo
        create_title(){
            var title_container = document.createElement('div')
            title_container.setAttribute('id', 'title_container')
            var title_inner_container = document.createElement('div')
            title_inner_container.setAttribute('id', 'title_inner_container')

            var title = document.createElement('h1')
            title.setAttribute('id', 'title')
            title.textContent='Blessed Chat'

            title_inner_container.append(title)
            title_container.append(title_inner_container)
            document.body.append(title_container)
        };

        //unirse(join form)
        create_join_form(){
            var parent = this;

            var join_container = document.createElement('div')
            join_container.setAttribute('id', 'join_container')
            var join_inner_container = document.createElement('div')
            join_inner_container.setAttribute('id', 'join_inner_conteiner')

            var join_button_container = document.createElement('div')
            join_button_container.setAttribute('id', 'join_button_container')

            var join_button = document.createElement('button')
            join_button.setAttribute('id', 'join_button')
            join_button.innerHTML = 'Join <i class="fas fa-sign-in-alt"></i>'

            var join_input_container = document.createElement('div')
            join_input_container.setAttribute('id', 'join_input_container')

            var join_input = document.createElement('input')
            join_input.setAttribute('id', 'join_input')
            join_input.setAttribute('maxlength', '15')
            
            join_input.onkeyup = function(){
                if(join_input.value.length > 0){
                    join_button.classList.add('enabled')
                    
                    join_button.onclick = function(){
                        parent.save_name(join_input.value)
                       
                        join_container.remove()
                        
                        parent.create_chat()
                    }
                }else{
                    join_button.classList.remove('enabled')
                }
            }
        };

        //circulo de carga
        create_load(container_id){

            var parent = this;

            var container = document.getElementById(container_id)
            container.innerHTML = ''

            var loader_container = document.createElement('div')
            loader_container.setAttribute('class', 'loader_container')

            var loader = document.createElement('div')
            loader.setAttribute('class', 'loader')

            loader_container.append(loader)
            container.append(load_container)
        }
        


      }
}