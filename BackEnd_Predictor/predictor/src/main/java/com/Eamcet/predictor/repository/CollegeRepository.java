package com.Eamcet.predictor.repository;

import com.Eamcet.predictor.model.College;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

/**
 * Repository interface for College entities.
 * Provides CRUD operations and specification-based queries for College objects.
 * 
 * This interface extends JpaRepository for basic database operations and 
 * JpaSpecificationExecutor for dynamic query building based on filter criteria.
 */
@Repository
public interface CollegeRepository extends JpaRepository<College, Integer>, JpaSpecificationExecutor<College> {

}