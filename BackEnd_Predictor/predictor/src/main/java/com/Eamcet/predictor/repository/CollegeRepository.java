package com.Eamcet.predictor.repository;

import com.Eamcet.predictor.model.RawTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface CollegeRepository extends JpaRepository<RawTable, Integer>, JpaSpecificationExecutor<RawTable> {
    // The previous @Query method is removed; filtering is now handled dynamically
    // by the JpaSpecificationExecutor and the Service layer's buildSpecifications.
}