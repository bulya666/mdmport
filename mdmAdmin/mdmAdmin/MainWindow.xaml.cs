using mdmAdmin.Data;
using mdmAdmin.Models;
using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using System.Linq;

namespace mdmAdmin
{
    public partial class MainWindow : Window
    {
        private readonly AppDbContext _db = new();

        public MainWindow()
        {
            InitializeComponent();
            LoadAll();
        }

        private void LoadAll()
        {
            LoadUsers();
            LoadGames();
            LoadPhotos();
            LoadOwned();
        }
        private void LoadUsers()
        {
            UserGrid.ItemsSource = _db.Users.ToList();
        }

        private void UserGrid_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (UserGrid.SelectedItem is User u)
            {
                UsernameBox.Text = u.Username;
                PasswordBox.Text = u.Password;
            }
        }

        private void AddUser_Click(object sender, RoutedEventArgs e)
        {
            var u = new User
            {
                Username = UsernameBox.Text,
                Password = PasswordBox.Text
            };

            _db.Users.Add(u);
            _db.SaveChanges();
            LoadUsers();
        }

        private void UpdateUser_Click(object sender, RoutedEventArgs e)
        {
            if (UserGrid.SelectedItem is not User u) return;

            u.Username = UsernameBox.Text;
            u.Password = PasswordBox.Text;

            _db.SaveChanges();
            LoadUsers();
        }

        private void DeleteUser_Click(object sender, RoutedEventArgs e)
        {
            if (UserGrid.SelectedItem is not User u) return;

            _db.Users.Remove(u);
            _db.SaveChanges();
            LoadUsers();
        }

        private void LoadGames()
        {
            GameGrid.ItemsSource = _db.Games.ToList();
        }

        private void GameGrid_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (GameGrid.SelectedItem is Game g)
            {
                GameTitleBox.Text = g.Title;
                GameTagBox.Text = g.Tag;
                GamePriceBox.Text = g.Price;
                GameDescBox.Text = g.Desc;
                GameThumbnailBox.Text = g.Thumbnail;
            }
        }

        private void AddGame_Click(object sender, RoutedEventArgs e)
        {
            var g = new Game
            {
                Title = GameTitleBox.Text,
                Tag = GameTagBox.Text,
                Price = GamePriceBox.Text,
                Desc = GameDescBox.Text,
                Thumbnail = GameThumbnailBox.Text
            };

            _db.Games.Add(g);
            _db.SaveChanges();
            LoadGames();
        }

        private void UpdateGame_Click(object sender, RoutedEventArgs e)
        {
            if (GameGrid.SelectedItem is not Game g) return;

            g.Title = GameTitleBox.Text;
            g.Tag = GameTagBox.Text;
            g.Price = GamePriceBox.Text;
            g.Desc = GameDescBox.Text;
            g.Thumbnail = GameThumbnailBox.Text;

            _db.SaveChanges();
            LoadGames();
        }

        private void DeleteGame_Click(object sender, RoutedEventArgs e)
        {
            if (GameGrid.SelectedItem is not Game g) return;

            _db.Games.Remove(g);
            _db.SaveChanges();
            LoadGames();
        }
        private void LoadPhotos()
        {
            PhotoGrid.ItemsSource = _db.GamePhotos.ToList();
        }

        private void PhotoGrid_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (PhotoGrid.SelectedItem is GamePhoto p)
            {
                PhotoGameIdBox.Text = p.GameId.ToString();
                PhotoPicBox.Text = p.Pic;
            }
        }

        private void AddPhoto_Click(object sender, RoutedEventArgs e)
        {
            if (!int.TryParse(PhotoGameIdBox.Text, out var gameId)) return;

            var p = new GamePhoto
            {
                GameId = gameId,
                Pic = PhotoPicBox.Text
            };

            _db.GamePhotos.Add(p);
            _db.SaveChanges();
            LoadPhotos();
        }

        private void UpdatePhoto_Click(object sender, RoutedEventArgs e)
        {
            if (PhotoGrid.SelectedItem is not GamePhoto p) return;
            if (!int.TryParse(PhotoGameIdBox.Text, out var gameId)) return;

            p.GameId = gameId;
            p.Pic = PhotoPicBox.Text;

            _db.SaveChanges();
            LoadPhotos();
        }

        private void DeletePhoto_Click(object sender, RoutedEventArgs e)
        {
            if (PhotoGrid.SelectedItem is not GamePhoto p) return;

            _db.GamePhotos.Remove(p);
            _db.SaveChanges();
            LoadPhotos();
        }

        private void LoadOwned()
        {
            OwnedGrid.ItemsSource = _db.Ownedg.ToList();
        }

        private void OwnedGrid_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (OwnedGrid.SelectedItem is Ownedg o)
            {
                OwnedUserIdBox.Text = o.UserId.ToString();
                OwnedGameIdBox.Text = o.GameId.ToString();
            }
        }

        private void AddOwned_Click(object sender, RoutedEventArgs e)
        {
            if (!int.TryParse(OwnedUserIdBox.Text, out var userId)) return;
            if (!int.TryParse(OwnedGameIdBox.Text, out var gameId)) return;

            var o = new Ownedg
            {
                UserId = userId,
                GameId = gameId
            };

            _db.Ownedg.Add(o);
            _db.SaveChanges();
            LoadOwned();
        }

        private void UpdateOwned_Click(object sender, RoutedEventArgs e)
        {
            if (OwnedGrid.SelectedItem is not Ownedg o) return;
            if (!int.TryParse(OwnedUserIdBox.Text, out var userId)) return;
            if (!int.TryParse(OwnedGameIdBox.Text, out var gameId)) return;

            o.UserId = userId;
            o.GameId = gameId;

            _db.SaveChanges();
            LoadOwned();
        }

        private void DeleteOwned_Click(object sender, RoutedEventArgs e)
        {
            if (OwnedGrid.SelectedItem is not Ownedg o) return;

            _db.Ownedg.Remove(o);
            _db.SaveChanges();
            LoadOwned();
        }
    }
}