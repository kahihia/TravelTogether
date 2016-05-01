angular.module('travel.controllers', [])
  .controller('TravelListCtrl', [
    '$scope', '$interval', 'TravelService', // <-- controller dependencies
    function($scope, $interval, TravelService) {
      function getTravels() {
        TravelService.findAllTravels().then(function(travels) {
          console.log('get travels');
          $scope.travelList = travels;
        });
      }
      getTravels();
      var interval = $interval(getTravels, 5000);
      $scope.$on("$ionicView.afterLeave", function(event, data) {
        $interval.cancel(interval);
      });
    }
  ])
  .controller('TravelDetailCtrl', [
    '$state', '$scope', '$stateParams', 'UserService', 'TravelService', // <-- controller dependencies
    function($state, $scope, $stateParams, UserService, TravelService) {
      TravelService.findCurTravelDetails($stateParams.travelId).then(function(details) {
        $scope.Details = details;
        console.log("Results:" + JSON.stringify(details));
      })
    }
  ])
  .controller('TravelCreateCtrl', [
    '$state', '$scope', '$stateParams', 'UserService', 'TravelService', 'AppService', // <-- controller dependencies
    function($state, $scope, $stateParams, UserService, TravelService, AppService) {
      $scope.cities = "Айтос,Аксаково,Алфатар,Антоново,Априлци,Ардино,Асеновград,Ахелой,Ахтопол,Балчик,Банкя,Банско,Баня,Батак,Батановци,Белене,Белица,Белово,Белоградчик,Белослав,Берковица,Благоевград,Бобов,Бобошево,Божурище,Бойчиновци,Болярово,Борово,Ботевград,Брацигово,Брегово,Брезник,Брезово,Брусарци,Бургас,Бухово,Българово,Бяла Слатина,Бяла черква,Бяла Варна,Бяла Русе,Варна,Велики,Велико,Велинград,Ветово,Ветрен,Видин,Враца,Вълчедръм,Вълчи,Върбица,Вършец,Габрово,Генерал,Главиница,Глоджево,Годеч,Горна,Гоце,Грамада,Гулянци,Гурково,Гълъбово,Две,Дебелец,Девин,Девня,Джебел,Димитровград,Димово,Добринище,Добрич,Долна Митрополия,Долна Оряховица,Долна баня,Долни Дъбник,Долни чифлик,Доспат,Драгоман,Дряново,Дулово,Дунавци,Дупница,Дългопол,Елена,Елин,Елхово,Етрополе,Завет,Земен,Златарица,Златица,Златоград,Ивайловград,Искър,Исперих,Ихтиман,Каблешково,Каварна,Казанлък,Калофер,Камено,Каолиново,Карлово,Карнобат,Каспичан,Кермен,Килифарево,Китен,Клисура,Кнежа,Козлодуй,Койнаре,Копривщица,Костандово,Костенец,Костинброд,Котел,Кочериново,Кресна,Криводол,Кричим,Крумовград,Кубрат,Куклен,Кула,Кърджали,Кюстендил,Левски,Летница,Ловеч,Лозница,Лом,Луковит,Лъки,Любимец,Лясковец,Мадан,Маджарово,Малко,Мартен,Мездра,Мелник,Меричлери,Мизия,Момин,Момчилград,Монтана,Мъглиж,Неделино,Несебър,Николаево,Никопол,Нова,Нови Искър,Нови Пазар,Обзор,Омуртаг,Опака,Оряхово,Павел,Павликени,Пазарджик,Панагюрище,Перник,Перущица,Петрич,Пещера,Пирдоп,Плачковци,Плевен,Плиска,Пловдив,Полски,Поморие,Попово,Пордим,Правец,Приморско,Провадия,Първомай,Раднево,Радомир,Разград,Разлог,Ракитово,Раковски,Рила,Роман,Рудозем,Русе,Садово,Самоков,Сандански,Сапарева,Свети,Свиленград,Свищов,Своге,Севлиево,Сеново,Септември,Силистра,Симеоновград,Симитли,Славяново,Сливен,Сливница,Сливо,Смолян,Смядово,Созопол,Сопот,София,Средец,Стамболийски,Стара,Стражица,Стралджа,Стрелча,Суворово,Сунгурларе,Сухиндол,Съединение,Сърница,Твърдица,Тервел,Тетевен,Тополовград,Троян,Трън,Тръстеник,Трявна,Тутракан,Търговище,Угърчин,Хаджидимово,Харманли,Хасково,Хисаря,Цар,Царево,Чепеларе,Червен,Черноморец,Чипровци,Чирпан,Шабла,Шивачево,Шипка,Шумен,Ябланица,Якоруда,Ямбол".split(",");
      $scope.travel = {
        seats: 4,
        allowsPets: false,
        allowsSmoking: false,
        price: 10
      };
      $scope.createTravel = function() {
        if (!validateTravel($scope.travel)) {
          return;
        }
        UserService.currentUser()
          .then(function(_user) {
            return TravelService.createTravel(_user, $scope.travel);
          })
          .then(function(travel) {
            AppService.alertSuccess("Your travel was created!");
            console.log("Successfully created travel: " + JSON.stringify(travel));
            $state.go('travel.list');
          });
      };

      function validateTravel(travel) {
        if (!(travel.from && travel.from != "" && travel.to && travel.to != "")) {
          AppService.alertError("Please fill travel destinations");
          return false;
        }
        return true;
      }
    }
  ]);
