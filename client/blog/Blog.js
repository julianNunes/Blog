Deps.autorun(function () {
   Meteor.subscribe("getPosts");
 
});

 //-/-/-/-/-/-/-/ INICIO /-/-/-/-//-/-/-/-/
Template.cabecalho.rendered = function() {

}

Template.cabecalho.events({
  'click #btnRegistrarHome' : function(){
    Router.go("registro");
    // return false; 
  },

  "click #btnLoginHome": function() {
    Router.go("login");
    return false;
  },

  'click #btnLogout' : function () {
    Meteor.logout();
    Router.go("novoPost");
    return false;
  },

  'click #btnHome' : function () {
    Router.go("novoPost");
    return false;
  },

  'click #btnRemover' : function (evt, tpl) {

    var r=confirm("Deseja remover todos os posts?");
    if (r==true)
    { Meteor.call("removeAllPosts", function (error, result) { }); }

    return false;
  }
});

Template.cabecalho.helpers({
   usuario: function (){
    if(Meteor.user()!=null) {
      return Meteor.user().username; 
    }
    return "";
   }
});

Template.login.events({
  'click #btnLogin' : function(evt, tpl){
      // retrieve the input field values
      var username = tpl.find('#loginEmail').value;
      var password = tpl.find('#loginPassword').value;

      if(username.length<=0)      { alert("Por favor digite um login");   return false; }
      if(password.length<=0)   { alert("Por favor digite uma senha");  return false; } 

      Meteor.loginWithPassword(username, password, function(err){
        if (err){
          alert("Usuario ou senha inválidos");
        }
        else {
          Router.go("novoPost");
        }
      });
    return false; 
  },

  "click #lkRegistro": function() {
    Router.go("registro");
  }
});

Template.registro.events({
  'click #btnRegistrar' : function(e, t) {
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
    Router.go("login");
  }
});


///-/-/-/-/-/------ POST ---/-/-/-/-/---//


Template.posts.helpers({
   listaComentario: function (){
      return Coments.find({idPost:this._id}, {sort: {data: -1}});
   },

   formatarData: function (){
      return moment(this.data).format("DD/MM/YYYY hh:mm");
   }
});

Template.posts.events({
  'click #lkTitulo': function (evt, tpl) {
    Router.go("postShow", {_idPost: this._id});
    return false;
  }
});

Template.novoPost.events({
  'click #btnPost' : function (evt, tpl) {
    
    var titulo = tpl.find("#txtTitulo").value;
    var descricao = tpl.find("#taDescricao").value;
    var usuario =  Meteor.user().username;

    if(usuario.length<=0)    { alert("Registre-se para criar um post");           return false; }
    if(titulo.length<=0)     { alert("Post sem titulo!\nPor favor inserir");      return false; }
    if(descricao.length<=0)  { alert("Post sem descrição!\nPor favor inserir");   return false; }

    return false;
  }
});

 //-/-/-/-/-/-/-/ INICIO /-/-/-/-//-/-/-/-/
Template.listaPosts.rendered = function() {
  console.log(this.data);
}

Template.novoComentario.rendered = function() {
    if(this.find("#taComentario")!=null) {
      this.find("#taComentario").value = ""; 
    }
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


Template.comentario.helpers({
   formatarData: function (){
      return moment(this.data).format("DD/MM/YYYY hh:mm");
   }
});
