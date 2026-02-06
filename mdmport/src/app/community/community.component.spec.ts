import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommunityComponent } from './community.component';
import { FormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { routes } from '../app.routes';
import { By } from '@angular/platform-browser';

describe('CommunityComponent', () => {
  let component: CommunityComponent;
  let fixture: ComponentFixture<CommunityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, CommunityComponent], 
      providers: [
      provideRouter(routes)
    ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CommunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load sample data on init', () => {
    component.ngOnInit();
    expect(component.articles.length).toBeGreaterThan(0);
    expect(component.comments.length).toBeGreaterThan(0);
  });

  it('should have correct comment counts for articles', () => {
    component.articles.forEach(article => {
      const actualCommentCount = component.getCommentsForArticle(article.id).length;
      expect(article.commentsCount).toBe(actualCommentCount);
    });
  });

  it('should open modal when article is clicked', () => {
    const article = component.articles[0];
    component.openArticleModal(article);

    expect(component.isModalOpen).toBeTrue();
    expect(component.selectedArticle).toBe(article);
  });

  it('should filter articles by category', () => {
    component.selectedCategory = 'game-updates';
    component.filterArticles();

    const filteredArticles = component.filteredArticles;
    const allGameUpdates = filteredArticles.every(article => article.category === 'game-updates');

    expect(allGameUpdates).toBeTrue();
  });

  it('should filter articles by search term', () => {
    component.searchTerm = 'frissítés';
    component.filterArticles();

    const filteredArticles = component.filteredArticles;
    const containsSearchTerm = filteredArticles.every(article =>
      article.title.toLowerCase().includes('frissítés') ||
      article.content.toLowerCase().includes('frissítés')
    );

    expect(filteredArticles.length).toBeGreaterThan(0);
  });

  it('should get correct category name', () => {
    const categoryName = component.getCategoryName('news');
    expect(categoryName).toBe('Hírek');
  });

  it('should get correct category color', () => {
    const color = component.getCategoryColor('news');
    expect(color).toBe('#4CAF50');
  });

  it('should handle ESC key to close modal', () => {
    component.openArticleModal(component.articles[0]);
    expect(component.isModalOpen).toBeTrue();

    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    component.handleEscapeKey(event);

    expect(component.isModalOpen).toBeFalse();
  });
});