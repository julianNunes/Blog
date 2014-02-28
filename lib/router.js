if(Meteor.isClient) {

    Router.configure({
        layoutTemplate: 'layout',
        yieldTemplates: {
            'cabecalho': {to: 'cabecalho'},
        }
    });

    Router.map(function() {
        this.route('inicio', {
            path: '/',
            template: 'inicio'   
        }), 

        this.route('registro', {
            path: '/registro',
            template: 'registro'
        }), 

        this.route('login', {
            path: '/login',
            template: 'login'   
        }), 

        this.route('posts', {
            path: '/posts',
            template: 'listaPosts',
            layoutTemplate: 'layoutPosts',
            yieldTemplates: {
                'cabecalho': {to: 'cabecalho'},
                'novoPost' : {to: 'novoPost'}
            },
            data : function(){
                return Posts.find();
            },
            waitOn : function() {
                this.subscribe("getPosts");
            }
        }), 

        this.route('postShow', {
            path: '/post/:_idPost',
            template: 'posts',
            data: function () {
                return Posts.findOne({_id: this.params._idPost});
            }
        }), 

        this.route('comentario', {
            path: '/post/:_idPost/comentario/:_idComentario',
            template: 'comentario'
        })
    });
}
