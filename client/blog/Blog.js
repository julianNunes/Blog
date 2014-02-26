
Deps.autorun(function () {
  Meteor.subscribe("getPostsUsaurio", Session.get("usuario"));
}) ;

//----- Post -----//
 Template.novoPost.rendered = function() {
    Session.set("usuario", "julian");
    this.find("#taDescricao").value = '';
  }

Template.novoPost.events({
  'click #btnPost' : function (evt, tpl) {
    
    var titulo = tpl.find("#txtTitulo").value;
    var descricao = tpl.find("#taDescricao").value;
    var usuario =  Session.get("usuario");

    if(usuario.length<=0)    { alert("Registre-se para criar um post"); return; }
    if(titulo.length<=0)     { alert("Post sem titulo!\nPor favor inserir"); return; }
    if(descricao.length<=0)  { alert("Post sem descrição!\nPor favor inserir");  return; }

    Posts.insert({usuario: usuario, titulo: titulo, descricao: descricao, data: new Date()});

    tpl.find("#txtTitulo").value = '';
    tpl.find("#taDescricao").value = '';
  },

  'click #btnRemove' : function (evt, tpl) {

    var r=confirm("Deseja remover todos os posts?");
    if (r==true)
    { Meteor.call("removeAllPosts", function (error, result) { }); }
  }
});

Template.novoPost.helpers({
   listaPost: function (){
      return Posts.find({}, {sort: {data: -1}});
   }
});

Template.novoComentario.rendered = function() {
    this.find(".taComentario").value = "";
  }

Template.novoComentario.events({
  'click #btnComentario' : function (evt, tpl) {
    
    var descricao = tpl.find("#taComentario").value;
    var usuario =  Session.get("usuario");

    if(usuario.length<=0)    { alert("Registre-se para criar um post"); return; }
    if(descricao.length<=0)  { alert("Insira um comentario");  return; }
    Coments.insert({usuario: usuario, descricao: descricao, data: new Date(), idPost: tpl.data._id});

    tpl.find("#taComentario").value = '';
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



