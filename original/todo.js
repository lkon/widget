//Модель Туду
//Наша базовая модель описывает элемент туду списка, который имеет атрибуты content, order и done.
window.Todo = Backbone.Model.extend({

    // Если вы не написали текст, это будет заглушкой
    // Это немного другой подход, в начале этой статьи мы использовали default
	// это констаната  - все заглавные
    EMPTY: "empty todo...",

    // Если модель не имеет `content`, подсовываем по умолчанию
    initialize: function() {
      if (!this.get("content")) {
        this.set({"content": this.EMPTY});
      }
    },

    // Переключаем статус `done`
    toggle: function() {
      this.save({done: !this.get("done")});
    },

    // Удаляем из localStorage и удаляем вид
    clear: function() {
      this.destroy();
      this.view.remove();
    }

  });


//Коллекция Туду
//Коллекция туду хранится в localStorage
  window.TodoList = Backbone.Collection.extend({

    // Эта коллекция будет состоять из моделей Todo
    model: Todo,

    // Сохраняем все туду под неймспейсом "todos" в localStorage
    localStorage: new Store("todos"),

    // Фильтр для получения списка тудушек, которые завершены
    done: function() {
      return this.filter(function(todo){ return todo.get('done'); });
    },

    // Фильтр для получения списка тудушек, которые не завершены
    remaining: function() {
      return this.without.apply(this, this.done());
    },

    // Мы сохраняем наши туду последовательно, в то время когда в базе они могут храниться хаотично.
    // В нашем случае мы используем GUID в качестве ключа. Этот метод получает следующий ид объекта.
    nextOrder: function() {
      if (!this.length) return 1;              // this === Todos
      return this.last().get('order') + 1;
    },

    // Туду отсортированы по порядку добавления в список
    comparator: function(todo) {
      return todo.get('order');
    }

  });

  // Создадим глобальную коллекцию тудушек
  window.Todos = new TodoList;


//Вид — Элемент туду

  // DOM Элемент для туду
  window.TodoView = Backbone.View.extend({

    // это элемент списка
    tagName:  "li",

    // Кэшируем шаблон
    // Код шаблона ниже в статье
    template: _.template($('#item-template').html()),

    // События DOM, которые связаны с туду
    events: {
      "click .check"              : "toggleDone",
      "dblclick div.todo-content" : "edit",
      "click span.todo-destroy"   : "clear",
      "keypress .todo-input"      : "updateOnEnter"
    },

    // TodoView слушает изменения модели и перерисовывает себя.
    initialize: function() {
      _.bindAll(this, 'render', 'close');
    // так как эта связь один-вид-одна-модель, то мы просто устанавливаем
    // связь с моделью напрямую.
      this.model.bind('change', this.render);
      this.model.view = this;
    },

    // Перерисовываем содержимое
    render: function() {
      $(this.el).html(this.template(this.model.toJSON()));
      this.setContent();
      return this;
    },

    // Для избежания XSS мы используем `jQuery.text` для изменения контента туду
    setContent: function() {
      var content = this.model.get('content');
      this.$('.todo-content').text(content);
      this.input = this.$('.todo-input');
      this.input.bind('blur', this.close);
      this.input.val(content);
    },

    // Переключаем состояние "done" у модели
    toggleDone: function() {
      this.model.toggle();
    },

    // Переключаем вид в режим редактирования
    edit: function() {
      $(this.el).addClass("editing");
      this.input.focus();
    },

    // Закрываем режим редактирования, сохраняем изменения
    close: function() {
      this.model.save({content: this.input.val()});
      $(this.el).removeClass("editing");
    },

    // Если нажать `enter`, то туду сохранится
    updateOnEnter: function(e) {
      if (e.keyCode == 13) this.close();
    },

    // Удаление DOM элемента
    remove: function() {
      $(this.el).remove();
    },

    // Удаление элемента и модели
    clear: function() {
      this.model.clear();
    }

  });


//Вид — Приложение

//Это базовый вид нашего приложения
  window.AppView = Backbone.View.extend({

    // Вместо того, чтобы создавать новый элемент привяжемся к существующему HTML скелету
    el: $("#todoapp"),

    // Шаблон для статистики
    // Код шаблона ниже в статье
    statsTemplate: _.template($('#stats-template').html()),

    // Составляем список событий для создания новых туду, очистки завершенных
    events: {
      "keypress #new-todo":  "createOnEnter",
      "click .todo-clear a": "clearCompleted"
    },

    // При инциализации мы начинаем слушать определенные события коллекции:
    // элементы изменены, добавлены, загружены. Тут же мы загружаем туду, которые были
    // сохранены в localStorage
    initialize: function() {
      _.bindAll(this, 'addOne', 'addAll', 'render');

      this.input    = this.$("#new-todo");

/*
 * Каталог событий  - Это список всех встроенных событий, которые может запускать Backbone.js. Вы так же вольны запускать свои собственные события на моделях и представлениях, как считаете нужным.
"add" (model, collection) — когда модель добавляется в коллекцию.
"remove" (model, collection) — когда модель удаляется из коллекции.
"reset" (collection) — когда все содержимое коллекции заменяется.
"change" (model, options) — когда атрибут модели меняется.
"change:[attribute]" (model, value, options) — когда меняется конкретный атрибут модели.
"destroy" (model, collection) — когда модель уничтожена.
"sync" (model, collection) — срабатывает, когда модель была успешно синхронизирована с сервером.
"error" (model, collection) — когда валидация модели проваливается, или вызов save проваливается на сервере.
"route:[name]" (router) — когда один из роутов находит соответствие.
"all" — это специальное событие срабатывает каждый раз, когда срабатывает любое событие, передавая имя события первым аргументом*/

      Todos.bind('add',     this.addOne);
      Todos.bind('refresh', this.addAll);
      Todos.bind('all',     this.render);

      Todos.fetch();
    },

    // Перерисовка приложение - обновление статистики. Остальное не меняется.
    render: function() {
      var done = Todos.done().length;
      this.$('#todo-stats').html(this.statsTemplate({
        total:      Todos.length,
        done:       Todos.done().length,
        remaining:  Todos.remaining().length
      }));
    },

    // Создание элемента туду. Создаем вид и засовываем в `<ul>`
    addOne: function(todo) {
      var view = new TodoView({model: todo});
      this.$("#todo-list").append(view.render().el);
    },

    // Отрисовываем все элементы
    addAll: function() {
      Todos.each(this.addOne);
    },

    // Создаем атрибуты для новых туду
    newAttributes: function() {
      return {
        content: this.input.val(),
        order:   Todos.nextOrder(),
        done:    false
      };
    },

    // Если нажать enter в поле ввода имени туду - создастся новая модель.
    // Создание модели вызовет определенные события которые по цепочке отрисуют новый элемент
    createOnEnter: function(e) {
      if (e.keyCode != 13) return;
      Todos.create(this.newAttributes());
      this.input.val('');
    },

    // Удаляем все завершенные туду, удаляем их модели.
    clearCompleted: function() {
      _.each(Todos.done(), function(todo){ todo.clear(); });
      return false;
    }

  });

  // Наконец - создаем наше приложение
  window.App = new AppView;