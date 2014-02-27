Session.set("estadoInicial", null); 

Deps.autorun(function () {
  if(Meteor.user()!=null){
    Meteor.subscribe("getPostsUsaurio", Meteor.user().username); }
});

 //-/-/-/-/-/-/-/ INICIO /-/-/-/-//-/-/-/-/
Template.inicio.rendered = function() {
  if(Session.equals("estadoInicial", null)) {
    Session.set("estadoInicial", "login"); 
  }
}

Template.login.events({
  'click #btnLogin' : function(evt, tpl){
      // e.preventDefault();
      // retrieve the input field values
      var username = tpl.find('#loginEmail').value;
      var password = tpl.find('#loginPassword').value;

      if(username.length<=0)      { alert("Por favor digite um login");   return false; }
      if(password.length<=0)   { alert("Por favor digite uma senha");  return false; } 

      // If validation passes, supply the appropriate fields to the
      // Meteor.loginWithPassword() function.
      Meteor.loginWithPassword(username, password, function(err){
        if (err){
          alert("Usuario ou senha inválidos");
          Session.set("estadoInicial", "login");
        }
        else {
          Session.set("estadoInicial", "logado");
        }
      });
    return false; 
  },

  "click #lkRegistro": function() {
      Session.set("estadoInicial", "registro");
  },
});

Template.login.isLogin = function() {
    return Session.equals("estadoInicial", "login");
}

Template.registro.events({
  'click #btnRegistrar' : function(e, t) {
      e.preventDefault();
      var username = t.find('#registroEmail').value;
      var password = t.find('#registroPassword').value;

      if(username.length<=0)      { alert("Por favor digite um login");  return false; }
      if(password.length<=0)   { alert("Por favor digite uma senha");  return false; }

      Accounts.createUser({username:username, password:password}, function(err){
        if (err) {
          alert("Erro ao registrar o usuario");
        } 
        else {
          Session.set("estadoInicial", "logado");
        }
      });
    return false;
  },

  "click #lkLogin": function() {
    Session.set("estadoInicial", "login");
  }
});

Template.registro.isRegistro= function() {
    return Session.equals("estadoInicial", "registro");
}

///-/-/-/-/-/------ POST ---/-/-/-/-/---//


 Template.novoPost.rendered = function() {
  }

Template.novoPost.events({
  'click #btnPost' : function (evt, tpl) {
    
    var titulo = tpl.find("#txtTitulo").value;
    var descricao = tpl.find("#taDescricao").value;
    var usuario =  Meteor.user().username;

    if(usuario.length<=0)    { alert("Registre-se para criar um post");           return false; }
    if(titulo.length<=0)     { alert("Post sem titulo!\nPor favor inserir");      return false; }
    if(descricao.length<=0)  { alert("Post sem descrição!\nPor favor inserir");   return false; }

    var r = Posts.insert({usuario: usuario, titulo: titulo, descricao: descricao, data: new Date()});
    console.log(r);

    tpl.find("#txtTitulo").value = '';
    tpl.find("#taDescricao").value = '';

    return false;
  },

  'click #btnRemove' : function (evt, tpl) {

    var r=confirm("Deseja remover todos os posts?");
    if (r==true)
    { Meteor.call("removeAllPosts", function (error, result) { }); }

    return false;
  },

  'click #btnLogout' : function (evt, tpl) {
    Session.set("estadoInicial", "login");
    Meteor.logout();
  }
});

Template.novoPost.helpers({
   listaPost: function (){
      return Posts.find({}, {sort: {data: -1}});
   },

   isLogado: function(){
      return Session.equals("estadoInicial", "logado"); 
   }
});

Template.novoComentario.rendered = function() {
    this.find("#taComentario").value = "";
  }

Template.novoComentario.events({
  'click #btnComentario' : function (evt, tpl) {
    
    console.log(tpl.find("#taComentario"));
    var descricao = tpl.find("#taComentario").value;
    var usuario =  Meteor.user().username;

    if(usuario.length<=0)    { alert("Registre-se para criar um post"); return false; }
    if(descricao.length<=0)  { alert("Insira um comentario");           return false; }
    
    Coments.insert({usuario: usuario, descricao: descricao, data: new Date(), idPost: tpl.data._id});
    tpl.find("#taComentario").value = '';
    return false;
  }
});

Template.posts.helpers({
   listaComentario: function (){
      return Coments.find({idPost:this._id}, {sort: {data: -1}});
   },

   formatarData: function (){
      return moment(this.data).format("DD/MM/YYYY hh:mm");
   }
});

Template.comentario.helpers({
   formatarData: function (){
      return moment(this.data).format("DD/MM/YYYY hh:mm");
   }
});
