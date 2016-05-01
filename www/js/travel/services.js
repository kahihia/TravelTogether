angular.module('travel.services', [])
  .service('TravelService', ['$q', 'ParseConfiguration',
    function($q, ParseConfiguration) {
      var cities = "Айтос,Аксаково,Алфатар,Антоново,Априлци,Ардино,Асеновград,Ахелой,Ахтопол,Балчик,Банкя,Банско,Баня,Батак,Батановци,Белене,Белица,Белово,Белоградчик,Белослав,Берковица,Благоевград,Бобов,Бобошево,Божурище,Бойчиновци,Болярово,Борово,Ботевград,Брацигово,Брегово,Брезник,Брезово,Брусарци,Бургас,Бухово,Българово,Бяла Слатина,Бяла черква,Бяла - Варна,Бяла - Русе,Варна,Велики,Велико,Велинград,Ветово,Ветрен,Видин,Враца,Вълчедръм,Вълчи,Върбица,Вършец,Габрово,Генерал,Главиница,Глоджево,Годеч,Горна,Гоце,Грамада,Гулянци,Гурково,Гълъбово,Две,Дебелец,Девин,Девня,Джебел,Димитровград,Димово,Добринище,Добрич,Долна Митрополия,Долна Оряховица,Долна баня,Долни Дъбник,Долни чифлик,Доспат,Драгоман,Дряново,Дулово,Дунавци,Дупница,Дългопол,Елена,Елин,Елхово,Етрополе,Завет,Земен,Златарица,Златица,Златоград,Ивайловград,Искър,Исперих,Ихтиман,Каблешково,Каварна,Казанлък,Калофер,Камено,Каолиново,Карлово,Карнобат,Каспичан,Кермен,Килифарево,Китен,Клисура,Кнежа,Козлодуй,Койнаре,Копривщица,Костандово,Костенец,Костинброд,Котел,Кочериново,Кресна,Криводол,Кричим,Крумовград,Кубрат,Куклен,Кула,Кърджали,Кюстендил,Левски,Летница,Ловеч,Лозница,Лом,Луковит,Лъки,Любимец,Лясковец,Мадан,Маджарово,Малко,Мартен,Мездра,Мелник,Меричлери,Мизия,Момин,Момчилград,Монтана,Мъглиж,Неделино,Несебър,Николаево,Никопол,Нова,Нови Искър,Нови Пазар,Обзор,Омуртаг,Опака,Оряхово,Павел,Павликени,Пазарджик,Панагюрище,Перник,Перущица,Петрич,Пещера,Пирдоп,Плачковци,Плевен,Плиска,Пловдив,Полски,Поморие,Попово,Пордим,Правец,Приморско,Провадия,Първомай,Раднево,Радомир,Разград,Разлог,Ракитово,Раковски,Рила,Роман,Рудозем,Русе,Садово,Самоков,Сандански,Сапарева,Свети,Свиленград,Свищов,Своге,Севлиево,Сеново,Септември,Силистра,Симеоновград,Симитли,Славяново,Сливен,Сливница,Сливо,Смолян,Смядово,Созопол,Сопот,София,Средец,Стамболийски,Стара,Стражица,Стралджа,Стрелча,Суворово,Сунгурларе,Сухиндол,Съединение,Сърница,Твърдица,Тервел,Тетевен,Тополовград,Троян,Трън,Тръстеник,Трявна,Тутракан,Търговище,Угърчин,Хаджидимово,Харманли,Хасково,Хисаря,Цар,Царево,Чепеларе,Червен,Черноморец,Чипровци,Чирпан,Шабла,Шивачево,Шипка,Шумен,Ябланица,Якоруда,Ямбол".split(",");
      var Travel = Parse.Object.extend('Travel');
      return {
        cities: cities,
        findTravelBetweenCities: function(from, to) {
          var defered = $q.defer();
          var travel = new Parse.Query(Travel);
          travel.equalTo("from", from);
          travel.equalTo("to", to);
          travel.find({
            success: function(travels) {
              defered.resolve(travels);
            },
            error: function(err) {
              defered.reject(travels);
            }
          });          return defered.promise;
        },
        findCurTravelDetails: function(_travelID) {
          var defered = $q.defer();
          var travel = new Parse.Query(Travel);
          travel.get(_travelID, {
            success: function(travel) {
              defered.resolve(travel);
            },
            error: function(err) {
              defered.reject(err);
            }
          });
          return defered.promise;
        },
        findMyTravels: function(_user) {
          var defered = $q.defer();
          var travel = new Parse.Query(Travel);
          travel.equalTo("user_id", _user.id);
          travel.find({
            success: function(travels) {
              defered.resolve(travels);
            },
            error: function(err) {
              defered.reject(travels);
            }
          });
          return defered.promise;
        },
        findAllTravels: function() {
          var defered = $q.defer();
          var travel = new Parse.Query(Travel);
          travel.find({
            success: function(travels) {
              defered.resolve(travels);
            },
            error: function(err) {
              defered.reject(travels);
            }
          });
          return defered.promise;
        },
        createTravel: function(_user, travelParams) {
          var defered = $q.defer();
          var myTravel = new Travel();
          myTravel.set('from', travelParams.from);
          myTravel.set('to', travelParams.to);
          myTravel.set('seats', parseInt(travelParams.seats));
          myTravel.set('allowsPets', travelParams.allowsPets);
          myTravel.set('allowsSmoking', travelParams.allowsSmoking);
          myTravel.set('price', parseInt(travelParams.price));
          myTravel.set('user_id', _user.id);
          var newACL = new Parse.ACL();
          newACL.setWriteAccess(_user.id, true);
          newACL.setReadAccess("*", true);
          myTravel.setACL(newACL);
          myTravel.save(null, {
            success: function(travel) {
              defered.resolve(travel);
            },
            error: function(travel, error) {
              alert('Failed to create new travel, with error code: ' + error.message);
              defered.reject(error);
            }
          });
          return defered.promise;
        }
      }
    }
  ]);
