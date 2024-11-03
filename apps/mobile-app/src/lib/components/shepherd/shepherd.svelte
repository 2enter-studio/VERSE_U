<script lang="ts">
import { onMount, type Snippet } from 'svelte';
import Shepherd from 'shepherd.js';
import 'shepherd.js/dist/css/shepherd.css'
import './shepherd.css'

let { children }: { children: Snippet } = $props();

let shepherd = new Shepherd.Tour({
	defaultStepOptions: {
		classes: 'shepherd-theme-custom',
		scrollTo: false,
		cancelIcon: {
			enabled: true
		},
		modalOverlayOpeningPadding: 10,
    modalOverlayOpeningRadius: 4,
	},
	useModalOverlay: true
});

const steps = [
  {
    id: 'introduction',
    text: '嗨！歡迎來到 VERSE-U ，這是由貳進 2ENTER 團隊所開發的社交遊戲。',
    classes: 'example-step-extra-class',
    buttons: [
      {
        classes: 'shepherd-button-red',
        text: '跳過',
        action: shepherd.cancel
      },
      {
        classes: 'shepherd-button-green',
        text: '下一步',
        action: shepherd.next
      },
    ]
  },
  {
    id: 'introduction',
    text: '在這之中，您可以幫您的角色換裝，與其他玩家互動，並探索各個景點，接下來會為您介紹遊戲的玩法。',
    classes: 'shepherd-footer-flex-end',
    buttons: [
      {
        classes: 'shepherd-button-green',
        text: '下一步',
        action: shepherd.next
      },
    ],
  },
  {
    id: 'info',
    attachTo: {
      element: '.shepherd-info',
      on: 'bottom'
    },
    classes: 'shepherd-bottom-aligned highlight-element',
    advanceOn: {
      selector: '.shepherd-info',
      event: 'click'
    },
    text: '在這裡，您可以查看您的個人資料。',
    buttons: [
      {
        classes: 'shepherd-button-red',
        text: '上一步',
        action: shepherd.back
      },
    ],
  },
  {
    id: 'info-2',
    text: '在這裡，您可以查看您的個人資料。',
    beforeShowPromise: () =>   {
      return new Promise((resolve) => {
        const checkExist = setInterval(() => {
          if (document.querySelector('.shepherd-dialog-content')) {
            clearInterval(checkExist);
            resolve(void 0);
          }
        }, 100);
      });
    },
    classes: 'shepherd-bottom-aligned',
    attachTo: {
      element: '.shepherd-dialog-content',
      on: 'bottom'
    },
    buttons: [
      {
        classes: 'shepherd-button-red',
        text: '上一步',
        action: shepherd.back
      },
      {
        classes: 'shepherd-button-green',
        text: '下一步',
        action: () => {
          const closeModal = document.querySelector('.shepherd-close-modal');
          closeModal?.click();
          shepherd.next();
        }
      }
    ]
  },
  {
    id: 'change-clothes',
    attachTo: {
      element: '.shepherd-clothes',
      on: 'right'
    },
    classes: 'shepherd-right-aligned highlight-element',
    advanceOn: {
      selector: '.shepherd-clothes',
      event: 'click'
    },
    text: '在這裡，您可以幫您的角色換裝，選擇您喜歡的服裝。',
    buttons: [
      {
        classes: 'shepherd-button-red',
        text: '上一步',
        action: shepherd.back
      },
    ]
  },
  {
    id: 'change-clothes-2',
    text: '這裡有許多服裝與配件，您可以幫您的角色換上您喜歡的外表。',
    beforeShowPromise: () =>   {
      return new Promise((resolve) => {
        const checkExist = setInterval(() => {
          if (document.querySelector('.shepherd-clothes-content')) {
            clearInterval(checkExist);
            resolve(void 0);
          }
        }, 100);
      });
    },
    classes: 'shepherd-right-aligned',
    attachTo: {
      element: '.shepherd-clothes-content',
      on: 'right'
    },
    buttons: [
      {
        classes: 'shepherd-button-red',
        text: '上一步',
        action: shepherd.back
      },
      {
        classes: 'shepherd-button-green',
        text: '下一步',
        action: () => {
          const back = document.querySelector('.shepherd-clothes-back');
          console.log('back', back);
          back?.click();
          shepherd.next();
        }
      }
    ]
  },
  {
    id: 'take-selfie',
    attachTo: {
      element: '.shepherd-selfie',
      on: 'right'
    },
    classes: 'shepherd-right-aligned highlight-element',
    beforeShowPromise: () =>   {
      return new Promise((resolve) => {
        const checkExist = setInterval(() => {
          if (document.querySelector('.shepherd-selfie')) {
            clearInterval(checkExist);
            resolve(void 0);
          }
        }, 100);
      });
    },
    advanceOn: {
      selector: '.shepherd-selfie',
      event: 'click'
    },
    text: '在這裡，您可以幫您的角色拍攝自拍照。',
    buttons: [
      {
        classes: 'shepherd-button-red',
        text: '上一步',
        action: shepherd.back
      },
    ]
  },
  {
    id: 'take-selfie-2',
    text: '在這裡您可以幫您的角色拍攝自拍照。',
    beforeShowPromise: () =>   {
      return new Promise((resolve) => {
        const checkExist = setInterval(() => {
          if (document.querySelector('.shepherd-selfie-take')) {
            clearInterval(checkExist);
            resolve(void 0);
          }
        }, 100);
      });
    },
    attachTo: {
      element: '.shepherd-selfie-take',
      on: 'top'
    },
    classes: 'shepherd-top-aligned',
    buttons: [
      {
        classes: 'shepherd-button-red',
        text: '上一步',
        action: shepherd.back
      },
      {
        classes: 'shepherd-button-green',
        text: '下一步',
        action: () => {
          const back = document.querySelector('.shepherd-selfie-back');
          back?.click();
          shepherd.next();
        }
      }
    ]
  },
  {
    id: 'me',
    attachTo: {
      element: '.shepherd-me',
      on: 'top'
    },
    classes: 'shepherd-top-aligned',
    text: '這裡可以看到您自己的角色，也就是是我們目前在的畫面，您可以在這裡進行剛才提到的所有操作。',
    buttons: [
      {
        classes: 'shepherd-button-red',
        text: '上一步',
        action: shepherd.back
      },
      {
        classes: 'shepherd-button-green',
        text: '下一步',
        action: shepherd.next
      }
    ]
  },
  {
    id: 'map',
    attachTo: {
      element: '.shepherd-map',
      on: 'top'
    },
    classes: 'shepherd-top-aligned highlight-element',
    advanceOn: {
      selector: '.shepherd-map',
      event: 'click'
    },
    text: '在這裡您可以查看地圖，此外，您也可以在這裡看到有誰跟你在同一個地方。',
    buttons: [
      {
        classes: 'shepherd-button-red',
        text: '上一步',
        action: shepherd.back
      },
    ]
  },
  {
    id: 'map-2',
    text: '此外，您也可以在這裡看到有誰跟你在同一個地方。',
    beforeShowPromise: () =>   {
      return new Promise((resolve) => {
        const checkExist = setInterval(() => {
          if (document.querySelector('.shepherd-map-content')) {
            clearInterval(checkExist);
            resolve(void 0);
          }
        }, 100);
      });
    },
    attachTo: {
      element: '.shepherd-map-content',
      on: 'bottom'
    },
    classes: 'shepherd-bottom-aligned',
    buttons: [
      {
        classes: 'shepherd-button-red',
        text: '上一步',
        action: shepherd.back
      },
      {
        classes: 'shepherd-button-green',
        text: '下一步',
        action: shepherd.next
      }
    ]
  },
  {
    id: 'social',
    attachTo: {
      element: '.shepherd-social',
      on: 'top'
    },
    advanceOn: {
      selector: '.shepherd-social',
      event: 'click'
    },
    classes: 'shepherd-top-aligned highlight-element',
    text: '在這裡，您可以與其他玩家交流，並查看他們的個人資料。',
    buttons: [
      {
        classes: 'shepherd-button-red',
        text: '上一步',
        action: shepherd.back
      },
    ]
  },
  {
    id: 'social-2',
    text: '這裡會顯示在附近的人，您可以與他們交流。',
    beforeShowPromise: () =>   {
      return new Promise((resolve) => {
        const checkExist = setInterval(() => {
          if (document.querySelector('.shepherd-social-players')) {
            clearInterval(checkExist);
            resolve(void 0);
          }
        }, 100);
      });
    },
    attachTo: {
      element: '.shepherd-social-players',
      on: 'bottom'
    },
    classes: 'shepherd-bottom-aligned',
    buttons: [
      {
        classes: 'shepherd-button-red',
        text: '上一步',
        action: shepherd.back
      },
      {
        classes: 'shepherd-button-green',
        text: '下一步',
        action: shepherd.next
      }
    ]
  },
  {
    id: 'social-chats-story',
    text: '在這裡，您可以查看其他玩家的動態。',
    attachTo: {
      element: '.shepherd-social-player-story',
      on: 'bottom'
    },
    advanceOn: {
      selector: '.shepherd-social-player-story',
      event: 'click'
    },
    classes: 'shepherd-bottom-aligned highlight-element',
    buttons: [
      {
        classes: 'shepherd-button-red',
        text: '上一步',
        action: shepherd.back
      },
    ]
  },
  {
    id: 'social-chats-story-chat',
    text: '點擊這裡，您可以與玩家進行第一次的聊天，需要花費 50 點 U-nergy。',
    beforeShowPromise: () =>   {
      return new Promise((resolve) => {
        const checkExist = setInterval(() => {
          if (document.querySelector('.shepherd-social-player-story-chat')) {
            clearInterval(checkExist);
            resolve(void 0);
          }
        }, 100);
      });
    },
    attachTo: {
      element: '.shepherd-social-player-story-chat',
      on: 'top'
    },
    classes: 'shepherd-top-aligned',
    buttons: [
      {
        classes: 'shepherd-button-red',
        text: '上一步',
        action: shepherd.back
      },
      {
        classes: 'shepherd-button-green',
        text: '下一步',
        action: () => {
          const close = document.querySelector('.shepherd-social-player-story-close');
          close?.click();
          shepherd.next();
        }
      }
    ]
  },
  {
    id: 'social-chats',
    text: '當您與其他玩家聊天後，您可以在此查看聊天紀錄，並繼續與他聊天。',
    attachTo: {
      element: '.shepherd-social-chats',
      on: 'top'
    },
    buttons: [
      {
        classes: 'shepherd-button-red',
        text: '上一步',
        action: shepherd.back
      },
      {
        classes: 'shepherd-button-green',
        text: '下一步',
        action: shepherd.next
      }
    ]
  },
  {
    id: 'ending',
    text: '恭喜您完成新手教學，現在，您可以開始探索 VERSE-U 的世界了！',
    classes: 'shepherd-footer-flex-end',
    buttons: [
      {
        classes: 'shepherd-button-green',
        text: '完成',
        action: () => {
          const close = document.querySelector('.shepherd-me');
          close?.click();
          shepherd.complete();
        }
      }
    ]
  }


]

shepherd.addSteps(steps);


onMount(() => {

	shepherd.start();
});
</script>

<style>

  .shepherd-theme-custom.example-step-extra-class.shepherd-element {
    background-color: rgb(254 249 195);
  }

</style>