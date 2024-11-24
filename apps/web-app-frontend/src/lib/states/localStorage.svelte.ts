class LocalStorage {
  hasCompletedTutorial = $state(false);

	setCompletedTutorial(value: boolean) {
		this.hasCompletedTutorial = value;
		localStorage.setItem('hasCompletedTutorial', value.toString());
  }
}

export const localStorageState = new LocalStorage();
