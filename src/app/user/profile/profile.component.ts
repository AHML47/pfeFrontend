import { Component } from '@angular/core';

interface UserProfile {
  id: number;
  nom: string;
  email: string;
  telephone: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  profile: UserProfile = {
    id: 1,
    nom: 'Utilisateur Test',
    email: 'test@email.com',
    telephone: '0600000000'
  };

  editMode = false;

  enableEdit() {
    this.editMode = true;
  }

  saveProfile() {
    // Ici, tu appellerais ton service pour sauvegarder
    this.editMode = false;
    alert('Profil sauvegardé !');
  }

  deleteProfile() {
    if (confirm('Supprimer votre profil ?')) {
      // Ici, tu appellerais ton service pour supprimer
      alert('Profil supprimé !');
      this.profile = { id: 0, nom: '', email: '', telephone: '' };
    }
  }
}