//������ ����
//���� ������� ������ ��������� ������� ���� ������, ������� ����� �������� content, order � done.
window.Todo = Backbone.Model.extend({

    // ���� �� �� �������� �����, ��� ����� ���������
    // ��� ������� ������ ������, � ������ ���� ������ �� ������������ default
	// ��� ����������  - ��� ���������
    EMPTY: "empty todo...",

    // ���� ������ �� ����� `content`, ����������� �� ���������
    initialize: function() {
      if (!this.get("content")) {
        this.set({"content": this.EMPTY});
      }
    },

    // ����������� ������ `done`
    toggle: function() {
      this.save({done: !this.get("done")});
    },

    // ������� �� localStorage � ������� ���
    clear: function() {
      this.destroy();
      this.view.remove();
    }

  });


//��������� ����
//��������� ���� �������� � localStorage
  window.TodoList = Backbone.Collection.extend({

    // ��� ��������� ����� �������� �� ������� Todo
    model: Todo,

    // ��������� ��� ���� ��� ����������� "todos" � localStorage
    localStorage: new Store("todos"),

    // ������ ��� ��������� ������ �������, ������� ���������
    done: function() {
      return this.filter(function(todo){ return todo.get('done'); });
    },

    // ������ ��� ��������� ������ �������, ������� �� ���������
    remaining: function() {
      return this.without.apply(this, this.done());
    },

    // �� ��������� ���� ���� ���������������, � �� ����� ����� � ���� ��� ����� ��������� ��������.
    // � ����� ������ �� ���������� GUID � �������� �����. ���� ����� �������� ��������� �� �������.
    nextOrder: function() {
      if (!this.length) return 1;              // this === Todos
      return this.last().get('order') + 1;
    },

    // ���� ������������� �� ������� ���������� � ������
    comparator: function(todo) {
      return todo.get('order');
    }

  });

  // �������� ���������� ��������� �������
  window.Todos = new TodoList;


//��� � ������� ����

  // DOM ������� ��� ����
  window.TodoView = Backbone.View.extend({

    // ��� ������� ������
    tagName:  "li",

    // �������� ������
    // ��� ������� ���� � ������
    template: _.template($('#item-template').html()),

    // ������� DOM, ������� ������� � ����
    events: {
      "click .check"              : "toggleDone",
      "dblclick div.todo-content" : "edit",
      "click span.todo-destroy"   : "clear",
      "keypress .todo-input"      : "updateOnEnter"
    },

    // TodoView ������� ��������� ������ � �������������� ����.
    initialize: function() {
      _.bindAll(this, 'render', 'close');
    // ��� ��� ��� ����� ����-���-����-������, �� �� ������ �������������
    // ����� � ������� ��������.
      this.model.bind('change', this.render);
      this.model.view = this;
    },

    // �������������� ����������
    render: function() {
      $(this.el).html(this.template(this.model.toJSON()));
      this.setContent();
      return this;
    },

    // ��� ��������� XSS �� ���������� `jQuery.text` ��� ��������� �������� ����
    setContent: function() {
      var content = this.model.get('content');
      this.$('.todo-content').text(content);
      this.input = this.$('.todo-input');
      this.input.bind('blur', this.close);
      this.input.val(content);
    },

    // ����������� ��������� "done" � ������
    toggleDone: function() {
      this.model.toggle();
    },

    // ����������� ��� � ����� ��������������
    edit: function() {
      $(this.el).addClass("editing");
      this.input.focus();
    },

    // ��������� ����� ��������������, ��������� ���������
    close: function() {
      this.model.save({content: this.input.val()});
      $(this.el).removeClass("editing");
    },

    // ���� ������ `enter`, �� ���� ����������
    updateOnEnter: function(e) {
      if (e.keyCode == 13) this.close();
    },

    // �������� DOM ��������
    remove: function() {
      $(this.el).remove();
    },

    // �������� �������� � ������
    clear: function() {
      this.model.clear();
    }

  });


//��� � ����������

//��� ������� ��� ������ ����������
  window.AppView = Backbone.View.extend({

    // ������ ����, ����� ��������� ����� ������� ���������� � ������������� HTML �������
    el: $("#todoapp"),

    // ������ ��� ����������
    // ��� ������� ���� � ������
    statsTemplate: _.template($('#stats-template').html()),

    // ���������� ������ ������� ��� �������� ����� ����, ������� �����������
    events: {
      "keypress #new-todo":  "createOnEnter",
      "click .todo-clear a": "clearCompleted"
    },

    // ��� ������������ �� �������� ������� ������������ ������� ���������:
    // �������� ��������, ���������, ���������. ��� �� �� ��������� ����, ������� ����
    // ��������� � localStorage
    initialize: function() {
      _.bindAll(this, 'addOne', 'addAll', 'render');

      this.input    = this.$("#new-todo");

/*
 * ������� �������  - ��� ������ ���� ���������� �������, ������� ����� ��������� Backbone.js. �� ��� �� ������ ��������� ���� ����������� ������� �� ������� � ��������������, ��� �������� ������.
"add" (model, collection) � ����� ������ ����������� � ���������.
"remove" (model, collection) � ����� ������ ��������� �� ���������.
"reset" (collection) � ����� ��� ���������� ��������� ����������.
"change" (model, options) � ����� ������� ������ ��������.
"change:[attribute]" (model, value, options) � ����� �������� ���������� ������� ������.
"destroy" (model, collection) � ����� ������ ����������.
"sync" (model, collection) � �����������, ����� ������ ���� ������� ���������������� � ��������.
"error" (model, collection) � ����� ��������� ������ �������������, ��� ����� save ������������� �� �������.
"route:[name]" (router) � ����� ���� �� ������ ������� ������������.
"all" � ��� ����������� ������� ����������� ������ ���, ����� ����������� ����� �������, ��������� ��� ������� ������ ����������*/

      Todos.bind('add',     this.addOne);
      Todos.bind('refresh', this.addAll);
      Todos.bind('all',     this.render);

      Todos.fetch();
    },

    // ����������� ���������� - ���������� ����������. ��������� �� ��������.
    render: function() {
      var done = Todos.done().length;
      this.$('#todo-stats').html(this.statsTemplate({
        total:      Todos.length,
        done:       Todos.done().length,
        remaining:  Todos.remaining().length
      }));
    },

    // �������� �������� ����. ������� ��� � ���������� � `<ul>`
    addOne: function(todo) {
      var view = new TodoView({model: todo});
      this.$("#todo-list").append(view.render().el);
    },

    // ������������ ��� ��������
    addAll: function() {
      Todos.each(this.addOne);
    },

    // ������� �������� ��� ����� ����
    newAttributes: function() {
      return {
        content: this.input.val(),
        order:   Todos.nextOrder(),
        done:    false
      };
    },

    // ���� ������ enter � ���� ����� ����� ���� - ��������� ����� ������.
    // �������� ������ ������� ������������ ������� ������� �� ������� �������� ����� �������
    createOnEnter: function(e) {
      if (e.keyCode != 13) return;
      Todos.create(this.newAttributes());
      this.input.val('');
    },

    // ������� ��� ����������� ����, ������� �� ������.
    clearCompleted: function() {
      _.each(Todos.done(), function(todo){ todo.clear(); });
      return false;
    }

  });

  // ������� - ������� ���� ����������
  window.App = new AppView;