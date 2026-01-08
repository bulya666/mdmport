import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommunityComponent } from './community.component';
import { FormsModule } from '@angular/forms';

describe('CommunityComponent', () => {
  let component: CommunityComponent;
  let fixture: ComponentFixture<CommunityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommunityComponent],
      imports: [FormsModule]
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
    expect(component.articles.length).toBeGreaterThan(0);
    expect(component.comments.length).toBeGreaterThan(0);
  });

  it('should toggle article like on/off', () => {
    const article = component.articles[0];
    const initialLikes = article.likes;
    const initialLiked = component.isArticleLiked(article);
    
    // Első like
    component.likeArticle(article);
    expect(article.likes).toBe(initialLikes + 1);
    expect(component.isArticleLiked(article)).toBe(!initialLiked);
    
    // Második like (lelike)
    component.likeArticle(article);
    expect(article.likes).toBe(initialLikes); // Vissza az eredeti értékre
    expect(component.isArticleLiked(article)).toBe(initialLiked);
  });

  it('should toggle comment like on/off', () => {
    const comment = component.comments[0];
    const initialLikes = comment.likes;
    const initialLiked = component.isCommentLiked(comment);
    
    // Első like
    component.likeComment(comment);
    expect(comment.likes).toBe(initialLikes + 1);
    expect(component.isCommentLiked(comment)).toBe(!initialLiked);
    
    // Második like (lelike)
    component.likeComment(comment);
    expect(comment.likes).toBe(initialLikes); // Vissza az eredeti értékre
    expect(component.isCommentLiked(comment)).toBe(initialLiked);
  });

  it('should have correct comment counts for articles', () => {
    // Ellenőrizzük, hogy minden cikk commentsCount mezője megegyezik a hozzá tartozó kommentek számával
    component.articles.forEach(article => {
      const actualCommentCount = component.getCommentsForArticle(article.id).length;
      expect(article.commentsCount).toBe(actualCommentCount);
    });
  });

  it('should increment comment count when adding new comment', () => {
    const article = component.articles[0];
    const initialCommentCount = article.commentsCount;
    
    component.selectedArticle = article;
    component.modalNewComment = {
      author: 'TesztFelhasználó',
      content: 'Teszt komment'
    };
    
    component.addCommentToArticle(article.id);
    
    expect(article.commentsCount).toBe(initialCommentCount + 1);
  });

  it('should open modal when article is clicked', () => {
    const article = component.articles[0];
    component.openArticleModal(article);
    
    expect(component.isModalOpen).toBeTrue();
    expect(component.selectedArticle).toBe(article);
  });

  it('should close modal', () => {
    component.openArticleModal(component.articles[0]);
    component.closeModal();
    
    expect(component.isModalOpen).toBeFalse();
    expect(component.selectedArticle).toBeNull();
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