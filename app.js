window.onload = function (){
    //configuracion de firebase
    var firebaseConfig = {
        apiKey:"********************",
        authDomain: "*************************",
        projectId: "**********************",
        storageBucket: "********************",
        messagingSenderId: "************",
        appId: "**********"
      };
      //inicializacion
      firebase.initializeApp(firebaseConfig);

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
        
        //creacion de chat
        create_chat(){

            var parent = this;

            var title_container = document.createElement('div')
            var title = document.getElementById('title')
            title_container.classList.add('chat_title_container')

            title.classList.add('chat_title')

            var chat_container = document.createElement('div')
            chat_container.setAttribute('id', 'chat_conteiner')

            var chat_inner_container = document.createElement('div')
            chat_inner_container.setAttribute('id', 'chat_inner_container')

            var chat_content_container = document.createElement('div')
            chat_content_container.setAttribute('id', 'chat_content_container')

            var chat_input_container = document.createElement('div')
            chat_input_container.setAttribute('id', 'chat_input_container')

            var chat_input_send = document.createElement('button')
            chat_input_send.setAttribute('id', 'chat_inpt_send')
            chat_input_send.setAttribute('disabled', true)
            chat_input_send.innerHTML = <i class="far fa-paper-plane"></i>
            
            var chat_input = document.createElement('input')
            chat_input.setAttribute('id', 'chat_input')

            chat_input.setAttribute('maxlength', 1000)

            //obtener el nombre del usuario
            chat_input.placeholder = `${parent.get_name()}. Escriba algo`
            chat_input.onkeyup = function(){

                if(chat_input.value.length > 0){
                    chat_input_send.removeAttribute('disabled')
                    chat_input_send.classList.add('enabled')
                    chat_input_send.onclick = function(){

                        chat_input_send.setAttribute('disabled', true)
                        chat_input_send.setAttribute('enabled')

                        if(chat_input.value.length <=0){
                            return
                        }

                        parent.create_load('chat_content_container')

                        parent.send_message(chat_input.value)

                        chat_input.value = ''

                        chat_input.focus()

                    }
                }else{
                    chat_input_send.classList.remove('enabeld')
                }
            }

            var chat_logout_container = document.createElement('div')
            chat_logout_container.setAttribute('id', 'chat_logout_container')

            var chat_logout = document.createElement('button')
            chat_logout.setAttribute('id', 'chat_logout')
            chat_logout.textContent = `${parent.get_name()} salir`

            chat_logout.onclick = function(){
                localStorage.clear()

                parent.home
            }

            chat_logout_container.append(chat_logout)
            chat_input_container.append(chat_input, chat_input_send)
            chat_inner_container.append(chat_content_container, chat_input_container, chat_logout_container)
            chat_container.append(chat_inner_container)
            document.body.append(chat_container)

            parent.create_load('chat_content_container')

            parent.refresh_chat()

        };

        //guardado de nombre
        save_name(name){
            localStorage.setItem('name', name)
        };

        //enviar mensaje
        send_message(message){

            var parent = this

            if(parent.get_name()== null && message == null){
                return
            }

            db.ref('chats/').once('value', function(message_object){

                var index = parseFloat(message_object.numChildren()) + 1
                db.ref('chats/'+ `message_${index}`).set({
                    name: parent.get_name(),
                    message: message,
                    index: index
                })
                .then(function(){
                    parent.refresh_chat()
                })
            })
        };

        //obtener nombre
        get_name(){
            if(localStorage.getItem('name') !=null){
                return localStorage.getItem('name')

            }else{
                this.home()
                return null
            }
        };

        //refrescar chat
        refresh_chat(){
            var chat_content_container = document.getElementById('chat_content_container')

            db.ref('chats/').on('value', function(message_object){

                chat_content_container.innerHTML = ''

                if(message_object.numChildren()==0){
                    return
                }

                var messages = Object.values(message_object.val());
                var guide = []
                var unorderd = []
                var ordered = []

                for(var i,i = 0; i< messages.length; i++){

                    guide.push(i+1)

                    unorderd.push([messages[i], messages[i].index]);
                }   

                guide.forEach(function(key) {
                    var found = false
                    unorderd = unorderd.filter(function(item){
                        
                        if(!found && item[1] == key){

                            ordered.push(item[0])
                            found = true
                            return false
                        }

                        ordered.forEach(function(data){
                            
                            var name = data.name
                            var message = data.message
                            
                            var message_container = document.createElement('div')
                            message_container.setAttribute('class','message_container')

                            var message_inner_container = document.createElement('div')
                            message_inner_container.setAttribute('class','message_inner_container')

                            var message_user_container = document.createElement('div')
                            message_user_container.setAttribute('class','message_user_container')

                            var message_user = document.createElement('p')
                            message_user.setAttribute('class','message_user')
                            message_user.textContent = `${name}`

                            var message_content_container = document.createElement('div')
                            message_content_container.setAttribute('class','message_content_container')

                            var message_content = document.createElement('p')
                            message_content.setAttribute('class', 'message_content')
                            message_content.textContent = `${message}`

                            message_user_container.append(message_user)
                            message_content_container.append(message_content)
                            message_inner_container.append(message_user_container, message_content_container)
                            message_container.append(message_inner_container)

                            chat_content_container.append(message_container)

                        });

                        chat_content_container.scrollTop = chat_content_container.scrollHeight;
                        
                    })
                })
            })
        }



      }

      //hacer la app
      var app = new blessedchat()

      //ir a home 
      if(app.get_name() != null){
          app.chat()

      }
}